export type BuildedQuery = {
    value: string
    type: "css" | "xpath"
}

export function css(query: string): BuildedQuery {
    return {
        value: query,
        type: "css",
    }
}

export function xpath(query: string): BuildedQuery {
    return {
        value: query,
        type: "xpath",
    }
}
