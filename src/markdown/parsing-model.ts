import { Marked } from "marked"

import { HtmlParsingModel } from "../html"
import { slugify } from "../utils/slugify"

export type MarkdownParsingModelParseOptions = {
    generateHeadingIds?: boolean
}

export const markdownParsingModelParseDefaultOptions = {
    generateHeadingIds: true
} satisfies MarkdownParsingModelParseOptions

export class MarkdownParsingModel extends HtmlParsingModel {
    parse(
        source: string,
        options: MarkdownParsingModelParseOptions = markdownParsingModelParseDefaultOptions
    ): Promise<any> {
        const marked = new Marked({
            ...(options.generateHeadingIds && {
                renderer: {
                    heading(text, level) {
                        const id = slugify(text)
                        return `<h${level} id="${id}">${text}</h${level}>`
                    },
                }
            })
        })

        const htmlSource = marked.parse(source)

        return super.parse(htmlSource)
    }
}