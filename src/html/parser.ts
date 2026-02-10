import htmlParser, { HTMLElement, Options as NodeHtmlOptions } from "node-html-parser"

import { ParsingModel } from "../parsing-model-interface"
import { HTMLElementNotFoundError } from "../errors"
import { ExtractorFunction } from "./extractors"
import { Parser } from "../parser"
import { BuildedQuery } from "../query-builders"
import { selectFirstElement, selectManyElements } from "../utils"

export type ParseManyOptions = {
    query: string
    extractor: ExtractorFunction
    limit?: number
}

export type ParseFirstOptions = {
    query?: BuildedQuery
    extractor: ExtractorFunction
    default?: string | null
}

export type ExtractFirstOptions = {
    query?: BuildedQuery
    model: ParsingModel
}

export type ExtractManyOptions = {
    query: BuildedQuery
    model: ParsingModel
    limit?: number
}

export const nodeHtmlParserOptions = {
    blockTextElements: {
        script: true,
		noscript: true,
		style: true,
		code: true
    }
} satisfies NodeHtmlOptions

export class HtmlParser extends Parser {
    readonly root: HTMLElement

    constructor(readonly source: string, options: NodeHtmlOptions = nodeHtmlParserOptions) {
        super(source)

        this.root = htmlParser.parse(source, options)
    }

    async parseMany({
        query,
        extractor,
        limit
    }: ParseManyOptions): Promise<(string | undefined)[]> {
        const elements = this.root.querySelectorAll(query)

        let items: (string | undefined)[] = []

        for (const element of elements) {
            if (limit != undefined && items.length >= limit) break
            const data = await extractor(element)
            items.push(data)
        }

        return items
    }

    async parseFirst({
        query,
        extractor,
        default: default_
    }: ParseFirstOptions): Promise<any | undefined | null> {
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

    async extractFirst({ model, query }: ExtractFirstOptions) {
        const element = query ? selectFirstElement(query, this.root) : this.root

        if (!element) {
            throw new HTMLElementNotFoundError(query)
        }

        return await model.parse(element.outerHTML)
    }

    async extractMany({ model, query, limit }: ExtractManyOptions) {
        const elements = selectManyElements(query, this.root)

        let dataList: any[] = []

        for (const element of elements) {
            if (limit != undefined && dataList.length >= limit) break
            const data = await model.parse(element.outerHTML)
            dataList.push(data)
        }

        return dataList
    }
}