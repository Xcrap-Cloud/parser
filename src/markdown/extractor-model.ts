import he from "he"

import { HtmlExtrctorModel, HtmlExtrctorModelShape, InferHtmlShape } from "../html"
import { markdownIt } from "./constants"

export class MarkdownExtractorModel<S extends HtmlExtrctorModelShape> extends HtmlExtrctorModel<S> {
    async extract(source: string): Promise<InferHtmlShape<S>> {
        const htmlSource = markdownIt.render(source)
        const decodedSource = he.decode(htmlSource).replace(/\u00A0/g, " ")
        return await super.extract(
            `<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${decodedSource}</body></html>`,
        )
    }
}
