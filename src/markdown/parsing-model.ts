import he from "he"

import { HtmlParsingModel } from "../html"
import { markdownIt } from "./constants"

export class MarkdownParsingModel extends HtmlParsingModel {
    parse(source: string): Promise<any> {
        const decodedInputSource = he.decode(source)
        const htmlSource = markdownIt.render(decodedInputSource)
        return super.parse(`<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${htmlSource}</body></html>`)
    }
}