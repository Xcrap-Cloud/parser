import htmlParser, { HTMLElement, Options as NodeHtmlOptions } from "node-html-parser"

import { selectFirstElement, selectManyElements } from "../utils"
import { ExtractionModel } from "../interfaces/extraction-model"
import { HTMLElementNotFoundError } from "../errors"
import { BuildedQuery } from "../query-builders"
import { ExtractorFunction } from "./extractors"
import { SourceParser } from "../source-parser"

export type ExtractValuesOptions = {
    query: BuildedQuery
    extractor: ExtractorFunction
    limit?: number
}

export type ExtractValueOptions = {
    query?: BuildedQuery
    extractor: ExtractorFunction
    default?: string | null
}

export type ExtractModelOptions<T = any> = {
    query?: BuildedQuery
    model: ExtractionModel<T>
}

export type ExtractModelsOptions<T = any> = {
    query: BuildedQuery
    model: ExtractionModel<T>
    limit?: number
}

export const nodeHtmlParserOptions = {
    blockTextElements: {
        script: true,
        noscript: true,
        style: true,
        code: true,
    },
} satisfies NodeHtmlOptions

export class HtmlParser extends SourceParser {
    readonly root: HTMLElement

    constructor(
        readonly source: string,
        options: NodeHtmlOptions = nodeHtmlParserOptions,
    ) {
        super(source)

        this.root = htmlParser.parse(source, options)
    }

    async extractValues({ query, extractor, limit }: ExtractValuesOptions): Promise<(string | undefined)[]> {
        const elements = selectManyElements(query, this.root)

        let items: (string | undefined)[] = []

        for (const element of elements) {
            if (limit != undefined && items.length >= limit) break
            const data = await extractor(element)
            items.push(data)
        }

        return items
    }

    async extractValue({ query, extractor, default: default_ }: ExtractValueOptions): Promise<any | undefined | null> {
        let data: any | undefined | null

        if (query) {
            const element = selectFirstElement(query, this.root)

            if (!element) {
                if (default_ !== undefined) {
                    return default_
                }

                throw new HTMLElementNotFoundError(query)
            }

            data = await extractor(element)
        } else {
            data = await extractor(this.root)
        }

        return data ?? default_
    }

    async extractModel<T>({ model, query }: ExtractModelOptions<T>): Promise<T> {
        const element = query ? selectFirstElement(query, this.root) : this.root

        if (!element) {
            throw new HTMLElementNotFoundError(query)
        }

        return await model.extract(element.outerHTML)
    }

    async extractModels<T>({ model, query, limit }: ExtractModelsOptions<T>): Promise<T[]> {
        const elements = selectManyElements(query, this.root)

        let dataList: any[] = []

        for (const element of elements) {
            if (limit != undefined && dataList.length >= limit) break
            const data = await model.extract(element.outerHTML)
            dataList.push(data)
        }

        return dataList
    }
}
