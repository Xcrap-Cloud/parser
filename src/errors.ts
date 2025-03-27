export class HTMLElementNotFoundError extends Error {
    constructor(query?: string) {
        super(`Element with query "${query || 'no query provided'}" not found`)
        this.name = "HTMLElementNotFoundError"
    }
}

export class MultipleQueryError extends Error {
    constructor() {
        super("Multiple value must have a 'query'")
        this.name = "MultipleQueryError"
    }
}

export class FieldNotFoundError extends Error {
    constructor(key: string) {
        super(`Field with key "${key}" not found`)
    }
}

export class ExtractorNotFoundError extends Error {
    constructor(name: string) {
        super(`Extractor with name "${name}" not found`)
    }
}