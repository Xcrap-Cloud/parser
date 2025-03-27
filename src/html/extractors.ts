import { Attributes, RawAttributes } from "node-html-parser/dist/nodes/html"
import { HTMLElement, NodeType } from "node-html-parser"

import { ExtractorNotFoundError, HTMLElementNotFoundError } from "../errors"

export type ExtractorFunctionReturnType = (string | undefined) | Promise<string | undefined>

export type ExtractorFunction<T = ExtractorFunctionReturnType> = (element: HTMLElement) => T

export type HtmlProperty = 
    | "innerText"
    | "textContent"
    | "text"
    | "innerHTML"
    | "outerHTML"
    | "tagName"
    | "classList"
    | "classNames"
    | "id"
    | "childElementCount"
    | "structure"
    | "structuredText"
    | "attributes"
    | "attrs"
    | "localName"
    | "nodeType"
    | "range"
    | "rawAttributes"
    | "rawAttrs"
    | "rawTagName"
    | "rawText"

export type HtmlAttribute =
    | "href"
    | "src"
    | "value"
    | "style"
    | "role"
    | "alt"
    | "title"
    | "placeholder"
    | "disabled"
    | "readonly"
    | "checked"
    | "selected"
    | "name"
    | "type"
    | "autocomplete"
    | "maxlength"
    | "minlength"
    | "pattern"
    | "required"
    | "aria-label"
    | "aria-hidden"
    | "aria-expanded"
    | "aria-checked"
    | "aria-disabled"
    | "data-*"
    | (string & {})

export const propertyExtractors: Record<HtmlProperty, (element: HTMLElement) => unknown | undefined> = {
    innerText: (element) => element.innerText,
    textContent: (element) => element.textContent,
    text: (element) => element.text,
    innerHTML: (element) => element.innerHTML,
    outerHTML: (element) => element.outerHTML,
    tagName: (element) => element.tagName,
    classList: (element) => Array.from(element.classList.values()),
    id: (element) => element.id,

    attributes: (element) => element.attributes,
    attrs: (element) => element.attrs,
    childElementCount: (element) => element.childElementCount,
    classNames: (element) => element.classNames,
    localName: (element) => element.localName,
    nodeType: (element) => element.localName,
    range: (element) => element.range,
    rawAttributes: (element) => element.rawAttributes,
    rawAttrs: (element) => element.rawAttrs,
    rawTagName: (element) => element.rawTagName,
    rawText: (element) => element.rawText,
    structure: (element) => element.structure,
    structuredText: (element) => element.structuredText,
}

export function extract<T extends HtmlProperty | HtmlAttribute, R = string>(
    key: T,
    isAttribute: boolean = false
): ExtractorFunction<R | undefined> {
    return (element: HTMLElement): R => {
        if (isAttribute) {
            return element.getAttribute(key) as R
        }

        const extractor = propertyExtractors[key as HtmlProperty]

        if (!extractor) {
            throw new ExtractorNotFoundError(key)
        }

        return extractor(element) as R
    }
}

export const extractInnerText = extract<"innerText", string>("innerText")
export const extractTextContent = extract<"textContent", string>("textContent")
export const extractText = extract<"text", string>("text")
export const extractInnerHtml = extract<"innerHTML", string>("innerHTML")
export const extractOuterHtml = extract<"outerHTML", string>("outerHTML")
export const extractTagName = extract<"tagName", string>("tagName")
export const extractClassList = extract<"classList", string[]>("classList")
export const extractId = extract<"id", string>("id")
export const extractHref = extract<"href", string>("href", true)
export const extractSrc = extract<"src", string>("src", true)
export const extractValue = extract<"value", string>("value", true)
export const extractStyle = extract<"style", string>("style", true)
export const extractRole = extract<"role", string>("role", true)
export const extractTitle = extract<"title", string>("title", true)
export const extractPlaceholder = extract<"placeholder", string>("placeholder", true)
export const extractDisabled = extract<"disabled", string>("disabled", true)
export const extractReadonly = extract<"readonly", string>("readonly", true)
export const extractChecked = extract<"checked", string>("checked", true)
export const extractSelected = extract<"selected", string>("selected", true)
export const extractName = extract<"name", string>("name", true)
export const extractType = extract<"type", string>("type", true)
export const extractAutocomplete = extract<"autocomplete", string>("autocomplete", true)
export const extractMaxLength = extract<"maxlength", string>("maxlength", true)
export const extractMinLength = extract<"minlength", string>("minlength", true)
export const extractPattern = extract<"pattern", string>("pattern", true)
export const extractRequired = extract<"required", string>("required", true)
export const extractAriaLabel = extract<"aria-label", string>("aria-label", true)
export const extractAriaHidden = extract<"aria-hidden", string>("aria-hidden", true)
export const extractAriaExpanded = extract<"aria-expanded", string>("aria-expanded", true)
export const extractAriaChecked = extract<"aria-checked", string>("aria-checked", true)
export const extractAriaDisabled = extract<"aria-disabled", string>("aria-disabled", true)
export const extractAllData = extract<"data-*", string>("data-*", true)
export const extractAttribute = <T extends string>(name: T) => extract<T, string>(name, true)
export const extractRange = extract<"range", [number, number]>("range")
export const extarctAttributes = extract<"attributes", Record<string, string>>("attributes")
export const extractAttrs = extract<"attrs", Attributes>("attrs")
export const extractChildElementCount = extract<"childElementCount", number>("childElementCount")
export const extractClassNames = extract<"classNames", string>("classNames")
export const extractLocalName = extract<"localName", string>("localName")
export const extractNodeType = extract<"nodeType", NodeType>("nodeType")
export const extractRawTagName = extract<"rawTagName", string>("rawTagName")
export const extractRawText = extract<"rawText", string>("rawText")
export const extractStructure = extract<"structure", string>("structure")
export const extractStructuredText = extract<"structuredText", string>("structuredText")
export const extarctRawAttributes = extract<"rawAttributes", RawAttributes>("rawAttributes")
export const extractRawAttrs = extract<"rawAttrs", string>("rawAttrs")

export type FromNextOrPreviousElementSiblingOptions = {
    shouldExists?: boolean
}

export const fromNextElementSibling = (
    extractor: ExtractorFunction,
    { shouldExists }: FromNextOrPreviousElementSiblingOptions = { shouldExists: true }
): ExtractorFunction => {
    return (element) => {
        const nextElementSibling = element.nextElementSibling

        if (!nextElementSibling) {
            if (shouldExists) {
                throw new HTMLElementNotFoundError()
            }

            return undefined
        }

        return extractor(nextElementSibling)
    }
}

export const fromPreviousElementSibling = (
    extractor: ExtractorFunction,
    { shouldExists }: FromNextOrPreviousElementSiblingOptions = { shouldExists: true }
): ExtractorFunction => {
    return (element) => {
        const previousElementSibling = element.previousElementSibling

        if (!previousElementSibling) {
            if (shouldExists) {
                throw new HTMLElementNotFoundError()
            }

            return undefined
        }

        return extractor(previousElementSibling)
    }
}