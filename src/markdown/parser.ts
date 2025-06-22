

import { HtmlParser } from "../html"
import { mardownIt } from "./constants"
export class MarkdownParser extends HtmlParser {
    readonly markdownSource: string

    constructor(source: string) {
        const htmlSource = mardownIt.render(source)
        super(htmlSource)
        this.markdownSource = source
    }
}