import anchorPlugin from "markdown-it-anchor"
import MarkdownIt from "markdown-it"

export const markdownIt = new MarkdownIt({
    html: true
}).use(anchorPlugin)