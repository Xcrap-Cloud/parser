import { Marked } from "marked"

import { slugify } from "../utils/slugify"
import { HtmlParser } from "../html"

export type MarkdownParserDefaultOptions = {
    generateHeadingIds?: boolean
}

export const markdownParserDefaultOptions = {
    generateHeadingIds: true
} satisfies MarkdownParserDefaultOptions

export class MarkdownParser extends HtmlParser {
    constructor(
        source: string,
        options: MarkdownParserDefaultOptions = markdownParserDefaultOptions
    ) {
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

        super(htmlSource)
    }
}