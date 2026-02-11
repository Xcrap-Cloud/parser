import { css, HtmlExtrctorModel, JsonExtractorModel, JsonParser } from "../src"
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

describe("JsonExtractorModel com model HtmlExtrctorModel", () => {
    test("deve extrair HTML de string JSON com sucesso", async () => {
        const source = '{ "key": "<p>text</p>" }'
        const extractorModel = new JsonExtractorModel({
            text: {
                query: "key",
                model: new HtmlExtrctorModel({
                    text: {
                        query: css("p"),
                        extractor: extractInnerText,
                    },
                }),
            },
        })
        const result = await extractorModel.extract(source)
        expect(result.text).toEqual({ text: "text" })
    })

    test("deve lançar erro se valor não for string ao usar model HtmlExtrctorModel", async () => {
        const source = '{ "key": { "xpto": "text" } }'
        const extractorModel = new JsonExtractorModel({
            text: {
                query: "key",
                model: new HtmlExtrctorModel({
                    text: {
                        query: css("p"),
                        extractor: extractInnerText,
                    },
                }),
            },
        })

        await expect(extractorModel.extract(source)).rejects.toThrow(/Expected a string for model parsing/)
    })
})
