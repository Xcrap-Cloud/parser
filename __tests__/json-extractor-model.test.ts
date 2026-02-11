import { JsonExtractionModel } from "../src"

describe("JsonExtractionModel integration test", () => {
    test("should correctly map JSON properties", async () => {
        const json = JSON.stringify({ name: "Marcuth", age: 19, contact: { email: "test@email.com" } })

        const extractionModel = new JsonExtractionModel({
            username: {
                query: "name",
            },
            email: {
                query: "contact.email",
            },
            age: {
                query: "age",
            },
        })

        const data = await extractionModel.extract(json)

        expect(data).toEqual({
            username: "Marcuth",
            email: "test@email.com",
            age: 19,
        })
    })

    test("should return null for missing properties", async () => {
        const json = JSON.stringify({ name: "Marcuth" })

        const extractionModel = new JsonExtractionModel({
            username: {
                query: "name",
            },
            email: {
                query: "contact.email",
            },
        })

        const data = await extractionModel.extract(json)

        expect(data).toEqual({
            username: "Marcuth",
            email: null,
        })
    })

    test("should throw error for invalid JSON", async () => {
        const invalidJson = "{ name: 'Marcuth' "

        const extractionModel = new JsonExtractionModel({
            username: {
                query: "name",
            },
        })

        await expect(extractionModel.extract(invalidJson)).rejects.toThrow(SyntaxError)
    })
})
