import { micromark } from "micromark"

import { HtmlParsingModel } from "../html"

export class MarkdownParsingModel extends HtmlParsingModel {
    parse(source: string): Promise<any> {
        const htmlSource = micromark(source)
        return super.parse(htmlSource)
    }
}