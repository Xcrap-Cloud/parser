import anchorPlugin from "markdown-it-anchor"
import MarkdownIt from "markdown-it"

export const mardownIt = new MarkdownIt({
    html: true
}).use(anchorPlugin)