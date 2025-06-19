import { JsonParsingModel } from "../src"

describe("JsonParsingModel integration test", () => {
    test("should correctly map JSON properties", async () => {
        const json = JSON.stringify({ name: "Marcuth", age: 19, contact: { email: "test@email.com" } })

        const parsingModel = new JsonParsingModel({
            username: {
                query: "name"
            },
            email: {
                query: "contact.email"
            },
            age: {
                query: "age"
            }
        })

        const data = await parsingModel.parse(json)

        expect(data).toEqual({
            username: "Marcuth",
            email: "test@email.com",
            age: 19
        })
    })

    test("should return null for missing properties", async () => {
        const json = JSON.stringify({ name: "Marcuth" })

        const parsingModel = new JsonParsingModel({
            username: {
                query: "name"
            },
            email: {
                query: "contact.email"
            }
        })

        const data = await parsingModel.parse(json)

        expect(data).toEqual({
            username: "Marcuth",
            email: null
        })
    })

    test("should throw error for invalid JSON",  async () => {
        const invalidJson = "{ name: 'Marcuth' "

        const parsingModel = new JsonParsingModel({
            username: {
                query: "name"
            }
        })

        await expect(parsingModel.parse(invalidJson)).rejects.toThrow(SyntaxError)
    })
})
