import * as jmespath from "jmespath"

import { ExtractorModel } from "../interfaces/extractor-model"

export type JsonExtractorModelShapeValue = {
    query: string
    default?: any
    model?: ExtractorModel
    multiple?: boolean
    limit?: number
}

export type JsonExtractorModelShape = {
    [key: string]: JsonExtractorModelShapeValue
}

export type InferJsonValue<V extends JsonExtractorModelShapeValue> =
    V["model"] extends ExtractorModel<infer M> ? (V["multiple"] extends true ? M[] : M) : any

export type InferJsonShape<S extends JsonExtractorModelShape> = {
    [K in keyof S]: InferJsonValue<S[K]>
}

export class JsonExtractorModel<S extends JsonExtractorModelShape> implements ExtractorModel<InferJsonShape<S>> {
    constructor(readonly shape: S) {}

    async extract(source: string): Promise<InferJsonShape<S>> {
        const root = JSON.parse(source)
        const data: any = {}

        for (const key in this.shape) {
            const value = this.shape[key]

            const isNestedValue = "model" in value

            if (isNestedValue) {
                data[key] = await this.extractNestedValue(value, root)
            } else {
                data[key] = this.extractValue(value, root)
            }
        }

        return data
    }

    extractValue(value: JsonExtractorModelShapeValue, root: any) {
        const extractedData = jmespath.search(root, value.query)

        if (extractedData === null && value.default !== undefined) {
            return value.default
        }

        return extractedData
    }

    async extractNestedValue(value: JsonExtractorModelShapeValue, root: any) {
        const extractedData = jmespath.search(root, value.query)
        const model = value.model!
        const modelIsJsonExtractor = model.constructor.name === JsonExtractorModel.name

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

            if (!modelIsJsonExtractor) {
                if (extractedData.some((item) => typeof item !== "string")) {
                    throw new Error(
                        `Expected an array of strings for model parsing, but got ${typeof extractedData[0]}`,
                    )
                }

                return await Promise.all(extractedData.map((item) => model.extract(JSON.stringify(item))))
            }
        } else {
            if (!modelIsJsonExtractor && typeof extractedData !== "string") {
                throw new Error(`Expected a string for model parsing, but got ${typeof extractedData}`)
            }

            if (!modelIsJsonExtractor) {
                return await model.extract(extractedData)
            }

            return await model.extract(JSON.stringify(extractedData))
        }

        return extractedData
    }
}
