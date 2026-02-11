import { extract, HtmlParser, HtmlExtractionModel, css } from "../src"

describe("HtmlParser integration test", () => {
    test("should extract title from HTML", async () => {
        const html = "<html><head><title>Example</title></head></html>"
        const parser = new HtmlParser(html)

        const title = await parser.extractValue({ query: css("title"), extractor: extract("innerText") })

        expect(title).toEqual("Example")
    })

    test("should extract multiple items from HTML", async () => {
        const html = `<html><body><h1>Itens</h1><ul><li>Item A</li><li>Item B</li><li>Item C</li><li>Item D</li></ul></body></html>`
        const parser = new HtmlParser(html)

        const data = await parser.extractValues({
            query: css("ul li"),
            extractor: extract("innerText"),
        })

        expect(data).toEqual(["Item A", "Item B", "Item C", "Item D"])
    })

    test("should extract product list from HTML", async () => {
        const html = `<html><body><h1>Items</h1><ul id="products"><li><span class="name">Product 1</span><span class="price">$ 20.00</span></li><li><span class="name">Product 2</span><span class="price">$ 25.00</span></li><li><span class="name">Product 3</span><span class="price">$ 15.90</span></li><li><span class="name">Product 4</span><span class="price">$ 13.80</span></li></ul></body></html>`
        const parser = new HtmlParser(html)

        const productExtractionModel = new HtmlExtractionModel({
            name: {
                query: css("span.name"),
                extractor: extract("textContent"),
            },
            price: {
                query: css("span.price"),
                extractor: extract("textContent"),
            },
        })

        const rootExtractionModel = new HtmlExtractionModel({
            products: {
                query: css("li"),
                multiple: true,
                model: productExtractionModel,
            },
        })

        const data = await parser.extractModel({ query: css("ul#products"), model: rootExtractionModel })

        expect(data).toEqual({
            products: [
                {
                    name: "Product 1",
                    price: "$ 20.00",
                },
                {
                    name: "Product 2",
                    price: "$ 25.00",
                },
                {
                    name: "Product 3",
                    price: "$ 15.90",
                },
                {
                    name: "Product 4",
                    price: "$ 13.80",
                },
            ],
        })
    })

    test("should return deafult value when extracting a non-existing element", async () => {
        const html = "<html><head></head><body></body></html>"
        const parser = new HtmlParser(html)

        const data = await parser.extractValue({
            query: css("h1"),
            extractor: extract("innerText"),
            default: null,
        })

        expect(data).toBeNull()
    })
})
