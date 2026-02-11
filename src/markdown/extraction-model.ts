import he from "he"

import { HtmlExtractionModel, HtmlExtractionModelShape, InferHtmlShape } from "../html"
import { markdownIt } from "./constants"

export class MarkdownExtractionModel<S extends HtmlExtractionModelShape> extends HtmlExtractionModel<S> {
    async extract(source: string): Promise<InferHtmlShape<S>> {
        const htmlSource = markdownIt.render(source)
        const decodedSource = he.decode(htmlSource).replace(/\u00A0/g, " ")
        return await super.extract(
            `<!DOCTYPE html><html lang="en"><head><title>Markdown Document</title></head><body>${decodedSource}</body></html>`,
        )
    }
}
