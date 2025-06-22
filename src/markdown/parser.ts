import { micromark } from "micromark"

import { HtmlParser } from "../html"

export class MarkdownParser extends HtmlParser {
    constructor(source: string) {
        const htmlSource = micromark(source)
        super(htmlSource)
    }
}