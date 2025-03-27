import htmlParser, { HTMLElement } from "node-html-parser"

import { MultipleQueryError, HTMLElementNotFoundError } from "../errors"
import { ParsingModel } from "../parsing-model-interface"
import { ExtractorFunction } from "./extractors"

export type HtmlParsingModelShapeBaseValue = {
    query?: string
    default?: string | string[] | null
    multiple?: boolean
    limit?: number
    extractor: ExtractorFunction
}

export type HtmlParsingModelShapeNestedValue = {
    query: string
    limit?: number
    multiple?: boolean
    model: ParsingModel
    extractor?: ExtractorFunction
}

export type HtmlParsingModelValue = HtmlParsingModelShapeBaseValue | HtmlParsingModelShapeNestedValue

export type HtmlParsingModelShape = {
    [key: string]: HtmlParsingModelValue
}

export type ParseBaseValueReturnType = (undefined | string)[] | string | null | undefined

export class HtmlParsingModel implements ParsingModel {
    constructor(readonly shape: HtmlParsingModelShape) {}

    async parse(source: string): Promise<any> {
        const root = htmlParser.parse(source)
        const data: Record<keyof typeof this.shape, any> = {}

        for (const key in this.shape) {
            const value = this.shape[key]

            const isNestedValue = "model" in value

            if (isNestedValue) {
                data[key] = await this.parseNestedValue(value, root)
            } else {
                data[key] = await this.parseBaseValue(value, root)
            }
        }
        
        return data
    }

    protected async parseBaseValue(value: HtmlParsingModelShapeBaseValue, root: HTMLElement): Promise<ParseBaseValueReturnType> {
        if (value.multiple) {
            if (!value.query) {
                throw new MultipleQueryError()
            }

            const elements = root.querySelectorAll(value.query)

            if (value.limit !== undefined) {
                elements.splice(value.limit)
            }

            return await Promise.all(
                elements.map(element => value.extractor(element))
            )
        } else {
            const element = value.query ? root.querySelector(value.query) : root

            if (!element) {
                if (value.default === undefined) {
                    throw new HTMLElementNotFoundError(value.query)
                }

                return value.default
            }

            return await value.extractor(element)
        }
    }

    protected async parseNestedValue(value: HtmlParsingModelShapeNestedValue, root: HTMLElement) {
        if (value.multiple) {
            const elements = root.querySelectorAll(value.query)

            if (value.limit !== undefined) {
                elements.splice(value.limit)
            }

            return await Promise.all(
                elements.map(element => value.model.parse(element.outerHTML))
            )
        } else {
            const element = root.querySelector(value.query)

            if (!element) {
                throw new HTMLElementNotFoundError(value.query)
            }

            const source = value.extractor ? await value.extractor(element) as string : element.outerHTML

            const data = await value.model.parse(source)

            return data
        }
    }
}