import { xpath, extract, HtmlExtractionModel } from "../src"

describe("HtmlExtractionModel with XPath integration test", () => {
    test("should extract title from HTML using XPath", async () => {
        const html = "<html><head><title>Example XPath</title></head></html>"

        const rootExtractionModel = new HtmlExtractionModel({
            title: {
                query: xpath("//title"),
                extractor: extract("innerText"),
            },
        })

        const data = await rootExtractionModel.extract(html)

        expect(data).toEqual({ title: "Example XPath" })
    })

    test("should extract attribute from HTML using XPath", async () => {
        const html = `<html><body><a href="https://example.com" class="link">Link</a></body></html>`

        const rootExtractionModel = new HtmlExtractionModel({
            linkHref: {
                query: xpath("//a[@class='link']"),
                extractor: extract("href"),
            },
        })

        const data = await rootExtractionModel.extract(html)

        expect(data).toEqual({ linkHref: "https://example.com" })
    })

    test("should extract multiple items from HTML using XPath", async () => {
        const html = `<html><body><h1>Items</h1><ul><li>Item A</li><li>Item B</li><li>Item C</li></ul></body></html>`

        const rootExtractionModel = new HtmlExtractionModel({
            items: {
                query: xpath("//li"),
                multiple: true,
                extractor: extract("innerText"),
            },
        })

        const data = await rootExtractionModel.extract(html)

        expect(data).toEqual({
            items: ["Item A", "Item B", "Item C"],
        })
    })

    test("should extract complex nested structure using XPath", async () => {
        const html = `
        <html>
            <body>
                <div class="product-list">
                    <div class="product">
                        <span class="name">Product X</span>
                        <span class="price">$ 10.00</span>
                    </div>
                    <div class="product">
                        <span class="name">Product Y</span>
                        <span class="price">$ 20.00</span>
                    </div>
                </div>
            </body>
        </html>`

        const productExtractionModel = new HtmlExtractionModel({
            name: {
                query: xpath(".//span[@class='name']"),
                extractor: extract("textContent"),
            },
            price: {
                query: xpath(".//span[@class='price']"),
                extractor: extract("textContent"),
            },
        })

        const rootExtractionModel = new HtmlExtractionModel({
            products: {
                query: xpath("//div[contains(@class, 'product') and not(contains(@class, 'product-list'))]"),
                multiple: true,
                model: productExtractionModel,
            },
        })

        const data = await rootExtractionModel.extract(html)

        expect(data).toEqual({
            products: [
                {
                    name: "Product X",
                    price: "$ 10.00",
                },
                {
                    name: "Product Y",
                    price: "$ 20.00",
                },
            ],
        })
    })

    test("should handle missing elements with default value using XPath", async () => {
        const html = "<html><body></body></html>"

        const rootExtractionModel = new HtmlExtractionModel({
            missing: {
                query: xpath("//h1"),
                default: "Not Found",
                extractor: extract("innerText"),
            },
        })

        const data = await rootExtractionModel.extract(html)

        expect(data).toEqual({ missing: "Not Found" })
    })

    test("should extract data using specific XPath functions", async () => {
        // XPath 1.0 support is limited in many JS libraries but let's see basic pathing
        const html = `
        <html>
            <body>
                <div id="container">
                    <p>First Paragraph</p>
                    <p>Second Paragraph</p>
                </div>
            </body>
        </html>`

        // Select the second paragraph
        const rootExtractionModel = new HtmlExtractionModel({
            secondPara: {
                query: xpath("//div[@id='container']/p[2]"),
                extractor: extract("innerText"),
            },
        })

        const data = await rootExtractionModel.extract(html)

        expect(data).toEqual({ secondPara: "Second Paragraph" })
    })
})
