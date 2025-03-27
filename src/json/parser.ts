import * as jmespath from "jmespath"

import { Parser } from "../parser"

export class JsonParser extends Parser {
    readonly data: any

    constructor(source: string) {
        super(source)

        this.data = JSON.parse(source)
    }

    extract(query: string): any {
        return jmespath.search(this.data, query)
    }
}