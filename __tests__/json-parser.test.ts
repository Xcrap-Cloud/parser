import { css, HtmlExtractionModel, JsonExtractionModel, JsonParser } from "../src"
import { extractInnerText } from "../src/html/extractors"

describe("JsonParser integration test", () => {
    test("should extract simple value from JSON", () => {
        const json = JSON.stringify({ name: "Marcuth", age: 19 })
        const parser = new JsonParser(json)

        expect(parser.extract("name")).toBe("Marcuth")
        expect(parser.extract("age")).toBe(19)
    })

    test("should extract nested values", () => {
        const json = JSON.stringify({ user: { details: { username: "marcuth", email: "marcuth@example.com" } } })
        const parser = new JsonParser(json)

        expect(parser.extract("user.details.username")).toBe("marcuth")
        expect(parser.extract("user.details.email")).toBe("marcuth@example.com")
    })

    test("should return null for non-existing property", () => {
        const json = JSON.stringify({ user: { name: "Marcuth" } })
        const parser = new JsonParser(json)

        expect(parser.extract("user.age")).toBeNull()
    })
})

describe("JsonExtractionModel com model HtmlExtractionModel", () => {
    test("deve extrair HTML de string JSON com sucesso", async () => {
        const source = '{ "key": "<p>text</p>" }'
        const extractionModel = new JsonExtractionModel({
            text: {
                query: "key",
                model: new HtmlExtractionModel({
                    text: {
                        query: css("p"),
                        extractor: extractInnerText,
                    },
                }),
            },
        })
        const result = await extractionModel.extract(source)
        expect(result.text).toEqual({ text: "text" })
    })

    test("deve lançar erro se valor não for string ao usar model HtmlExtractionModel", async () => {
        const source = '{ "key": { "xpto": "text" } }'
        const extractionModel = new JsonExtractionModel({
            text: {
                query: "key",
                model: new HtmlExtractionModel({
                    text: {
                        query: css("p"),
                        extractor: extractInnerText,
                    },
                }),
            },
        })

        await expect(extractionModel.extract(source)).rejects.toThrow(/Expected a string for model parsing/)
    })
})
