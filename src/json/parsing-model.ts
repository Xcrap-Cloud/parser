import * as jmespath from "jmespath"

import { ParsingModel } from "../parsing-model-interface"
import { HtmlParsingModel } from "../html"

export type JsonParsingModelShapeValue = {
    query: string
    default?: any
    model?: ParsingModel
    multiple?: boolean
    limit?: number
}

export type JsonParsingModelShape = {
    [key: string]: JsonParsingModelShapeValue
}

export class JsonParsingModel implements ParsingModel {
    constructor(readonly shape: JsonParsingModelShape) {}

    async parse(source: string) {
        const root = JSON.parse(source)
        const data: Record<keyof typeof this.shape, any> = {}

        for (const key in this.shape) {
            const value = this.shape[key]

            const isNestedValue = "model" in value

            if (isNestedValue) {
                data[key] = await this.parseNestedValue(value, root)
            } else {
                data[key] = this.parseValue(value, root)
            }
        }

        return data
    }

    parseValue(value: JsonParsingModelShapeValue, root: any) {
        const extractedData = jmespath.search(root, value.query)

        if (extractedData === null && value.default !== undefined) {
            return value.default
        }

        return extractedData
    }

    async parseNestedValue(value: JsonParsingModelShapeValue, root: any) {
        const extractedData = jmespath.search(root, value.query)
        const model = value.model!
        const modelIsJsonParser = model.constructor.name === JsonParsingModel.name

        if (extractedData === null && value.default !== undefined) {
            return value.default
        }

        if (value.multiple) {
            if (!Array.isArray(extractedData)) {
                throw new Error(`Expected an array for multiple values, but got ${typeof extractedData}`)
            }

            if (value.limit !== undefined) {
                extractedData.splice(value.limit)
            }

            if (!modelIsJsonParser) {
                if (extractedData.some(item => typeof item !== "string")) {
                    throw new Error(`Expected an array of strings for model parsing, but got ${typeof extractedData[0]}`)
                }

                return await Promise.all(
                    extractedData.map(item => model.parse(
                        JSON.stringify(item)
                    ))
                )
            }

        } else {
            if (!modelIsJsonParser && typeof extractedData !== "string") {
                throw new Error(`Expected a string for model parsing, but got ${typeof extractedData}`)
            }

            if (!modelIsJsonParser) {
                return await model.parse(extractedData)
            }

            return await model.parse(
                JSON.stringify(extractedData)
            )
        }

        return extractedData
    }
}
