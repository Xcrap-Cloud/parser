import { JsonParser } from "../src"

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
        const json = JSON.stringify({ "user": { "name": "Marcuth" } })
        const parser = new JsonParser(json)

        expect(parser.extract("user.age")).toBeNull()
    })
})