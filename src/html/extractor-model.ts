import htmlParser, { HTMLElement, Options as NodeHtmlOptions } from "node-html-parser"

import { MultipleQueryError, HTMLElementNotFoundError } from "../errors"
import { selectManyElements, selectFirstElement } from "../utils"
import { ExtractorModel } from "../interfaces/extractor-model"
import { BuildedQuery } from "../query-builders"
import { ExtractorFunction } from "./extractors"
import { nodeHtmlParserOptions } from "./parser"

export type HtmlExtrctorModelShapeBaseValue = {
    query?: BuildedQuery
    default?: string | string[] | null
    multiple?: boolean
    limit?: number
    extractor: ExtractorFunction
}

export type HtmlExtrctorModelShapeNestedValue = {
    query: BuildedQuery
    limit?: number
    multiple?: boolean
    model: ExtractorModel
    extractor?: ExtractorFunction
}

export type HtmlExtrctorModelValue = HtmlExtrctorModelShapeBaseValue | HtmlExtrctorModelShapeNestedValue

export type HtmlExtrctorModelShape = {
    [key: string]: HtmlExtrctorModelValue
}

export type InferHtmlValue<V extends HtmlExtrctorModelValue> = V extends HtmlExtrctorModelShapeNestedValue
    ? V["multiple"] extends true
        ? V["model"] extends ExtractorModel<infer M>
            ? M[]
            : any
        : V["model"] extends ExtractorModel<infer M>
          ? M
          : any
    : V extends HtmlExtrctorModelShapeBaseValue
      ? V["multiple"] extends true
          ? Awaited<ReturnType<V["extractor"]>>[]
          : Awaited<ReturnType<V["extractor"]>>
      : never

export type InferHtmlShape<S extends HtmlExtrctorModelShape> = {
    [K in keyof S]: InferHtmlValue<S[K]>
}

export type ParseBaseValueReturnType = (undefined | string)[] | string | null | undefined

export class HtmlExtrctorModel<S extends HtmlExtrctorModelShape> implements ExtractorModel<InferHtmlShape<S>> {
    constructor(readonly shape: S) {}

    async extract(source: string, options: NodeHtmlOptions = nodeHtmlParserOptions): Promise<InferHtmlShape<S>> {
        const root = htmlParser.parse(source, options)
        const data: any = {}

        for (const key in this.shape) {
            const value = this.shape[key]

            const isNestedValue = "model" in value

            if (isNestedValue) {
                data[key] = await this.extractNestedValue(value, root)
            } else {
                data[key] = await this.extractBaseValue(value, root)
            }
        }

        return data
    }

    protected async extractBaseValue(
        value: HtmlExtrctorModelShapeBaseValue,
        root: HTMLElement,
    ): Promise<ParseBaseValueReturnType> {
        if (value.multiple) {
            if (!value.query) {
                throw new MultipleQueryError()
            }

            const elements = selectManyElements(value.query, root)

            if (value.limit !== undefined) {
                elements.splice(value.limit)
            }

            return await Promise.all(elements.map((element) => value.extractor(element)))
        } else {
            const element = value.query ? selectFirstElement(value.query, root) : root

            if (!element) {
                if (value.default === undefined) {
                    throw new HTMLElementNotFoundError(value.query)
                }

                return value.default
            }

            return await value.extractor(element)
        }
    }

    protected async extractNestedValue(value: HtmlExtrctorModelShapeNestedValue, root: HTMLElement) {
        if (value.multiple) {
            const elements = selectManyElements(value.query, root)

            if (value.limit !== undefined) {
                elements.splice(value.limit)
            }

            return await Promise.all(elements.map((element) => value.model.extract(element.outerHTML)))
        } else {
            const element = selectFirstElement(value.query, root)

            if (!element) {
                throw new HTMLElementNotFoundError(value.query)
            }

            const source = value.extractor ? ((await value.extractor(element)) as string) : element.outerHTML

            const data = await value.model.extract(source)

            return data
        }
    }
}
