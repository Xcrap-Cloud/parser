import { DOMParser as XmldomParser } from "xmldom"
import { HTMLElement } from "node-html-parser"
import htmlParser from "node-html-parser"
import * as xpathLib from "xpath"

import { BuildedQuery } from "../query-builders"

export function selectManyElements(query: BuildedQuery, root: HTMLElement) {
    if (query.type === "css") {
        return root.querySelectorAll(query.value)
    } else {
        const doc = new XmldomParser().parseFromString(root.toString())
        const elements = xpathLib.select(query.value, doc) as Node[]
        return elements.map(element => htmlParser.parse(element.toString()).childNodes[0] as HTMLElement)
    }
}