import { HtmlParsingModel } from "../html"
import { markdownIt } from "./constants"

export class MarkdownParsingModel extends HtmlParsingModel {
    parse(source: string): Promise<any> {
        const htmlSource = markdownIt.render(source)
        return super.parse(`<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${htmlSource}</body></html>`)
    }
}