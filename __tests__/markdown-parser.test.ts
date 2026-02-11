import { css, extract, MarkdownParser } from "../src"

describe("HtmlParser integration test", () => {
    test("should extract heading from Markdown", async () => {
        const markdown = "# Example"
        const parser = new MarkdownParser(markdown)

        const heading = await parser.extractValue({ query: css("h1#example"), extractor: extract("innerText") })

        expect(heading).toEqual("Example")
    })

    test("should extract multiple items from Markdown", async () => {
        const markdown = `# Itens\n\n- Item A\n- Item B\n- Item C\n- Item D`
        const parser = new MarkdownParser(markdown)

        const data = await parser.extractValues({
            query: css("ul li"),
            extractor: extract("innerText"),
        })

        expect(data).toEqual(["Item A", "Item B", "Item C", "Item D"])
    })

    test("should suppoort HTML Tags", async () => {
        const markdown = `<h1>Example</h1>`
        const parser = new MarkdownParser(markdown)

        const heading = await parser.extractValue({ query: css("h1"), extractor: extract("innerText") })

        expect(heading).toEqual("Example")
    })
})
