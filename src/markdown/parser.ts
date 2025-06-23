import { markdownIt } from "./constants"
import { HtmlParser } from "../html"

export class MarkdownParser extends HtmlParser {
    readonly markdownSource: string

    constructor(source: string) {
        const htmlSource = markdownIt.render(source)
        super(`<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${htmlSource}</body></html>`)
        this.markdownSource = source
    }
}