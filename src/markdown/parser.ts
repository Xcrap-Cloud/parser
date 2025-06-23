import he from "he"

import { markdownIt } from "./constants"
import { HtmlParser } from "../html"

export class MarkdownParser extends HtmlParser {
    readonly markdownSource: string

    constructor(source: string) {
        const decodedInputSource = he.decode(source)
        const htmlSource = markdownIt.render(`<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${decodedInputSource}</body></html>`)
        super(htmlSource)
        this.markdownSource = source
    }
}