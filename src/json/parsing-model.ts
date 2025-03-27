import * as jmespath from "jmespath"

import { ParsingModel } from "../parsing-model-interface"

export type JsonParsingModelShapeValue = {
    query: string
    default?: any
}

export type JsonParsingModelShape = {
    [key: string]: JsonParsingModelShapeValue
}

export class JsonParsingModel implements ParsingModel {
    constructor(readonly shape: JsonParsingModelShape) {}

    parse(source: string) {
        const root = JSON.parse(source)
        const data: Record<keyof typeof this.shape, any> = {}

        for (const key in this.shape) {
            const value = this.shape[key]

            data[key] = this.parseValue(value, root)
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
}
