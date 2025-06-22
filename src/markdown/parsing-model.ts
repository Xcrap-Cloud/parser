import { HtmlParsingModel } from "../html"
import { mardownIt } from "./constants"

export class MarkdownParsingModel extends HtmlParsingModel {
    parse(source: string): Promise<any> {
        const htmlSource = mardownIt.render(source)
        return super.parse(htmlSource)
    }
}