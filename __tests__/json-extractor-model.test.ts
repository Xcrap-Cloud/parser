import { JsonExtractorModel } from "../src"

describe("JsonExtractorModel integration test", () => {
    test("should correctly map JSON properties", async () => {
        const json = JSON.stringify({ name: "Marcuth", age: 19, contact: { email: "test@email.com" } })

        const extractorModel = new JsonExtractorModel({
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

        const data = await extractorModel.extract(json)

        expect(data).toEqual({
            username: "Marcuth",
            email: "test@email.com",
            age: 19,
        })
    })

    test("should return null for missing properties", async () => {
        const json = JSON.stringify({ name: "Marcuth" })

        const extractorModel = new JsonExtractorModel({
            username: {
                query: "name",
            },
            email: {
                query: "contact.email",
            },
        })

        const data = await extractorModel.extract(json)

        expect(data).toEqual({
            username: "Marcuth",
            email: null,
        })
    })

    test("should throw error for invalid JSON", async () => {
        const invalidJson = "{ name: 'Marcuth' "

        const extractorModel = new JsonExtractorModel({
            username: {
                query: "name",
            },
        })

        await expect(extractorModel.extract(invalidJson)).rejects.toThrow(SyntaxError)
    })
})
