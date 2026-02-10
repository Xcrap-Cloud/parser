import { DOMParser as XmldomParser } from "xmldom"
import { HTMLElement } from "node-html-parser"
import htmlParser from "node-html-parser"
import * as xpathLib from "xpath"

import { BuildedQuery } from "../query-builders"

export function selectFirstElement(query: BuildedQuery, root: HTMLElement) {
    if (query.type === "css") {
        return root.querySelector(query.value)
    } else {
        const doc = new XmldomParser({
            locator: {},
            errorHandler: {
                warning: () => {},
            }
        }).parseFromString(root.toString())
        
        const elements = xpathLib.select(query.value, doc) as Node[]

        if (!elements || elements.length === 0) {
            return null
        }

        return htmlParser.parse(elements[0].toString()).childNodes[0] as HTMLElement
    }
}