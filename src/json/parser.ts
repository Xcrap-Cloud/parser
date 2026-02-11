import * as jmespath from "jmespath"

import { SourceParser } from "../source-parser"

export class JsonParser extends SourceParser {
    readonly data: any

    constructor(source: string) {
        super(source)

        this.data = JSON.parse(source)
    }

    extract(query: string): any {
        return jmespath.search(this.data, query)
    }
}
