import he from "he"

import { markdownIt } from "./constants"
import { HtmlParser } from "../html"

export class MarkdownParser extends HtmlParser {
    readonly markdownSource: string

    constructor(source: string) {
        const htmlSource = markdownIt.render(source)
        const decodedSource = he.decode(htmlSource).replace(/\u00A0/g, " ")
        super(`<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${decodedSource}</body></html>`)
        this.markdownSource = source
    }
}