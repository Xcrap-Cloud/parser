import { extract, HtmlParsingModel, JsonParsingModel } from "../src"

describe("HtmlParsingModel integration test", () => {
    test("should extract title from HTML", async () => {
        const html = "<html><head><title>Example</title></head></html>"

        const rootParsingModel = new HtmlParsingModel({
            title: {
                query: "title",
                extractor: extract("innerText")
            }
        })

        const data = await rootParsingModel.parse(html)

        expect(data).toEqual({ title: "Example" })
    })

    test("should extract multiple items from HTML", async () => {
        const html = `<html><body><h1>Itens</h1><ul><li>Item A</li><li>Item B</li><li>Item C</li><li>Item D</li></ul></body></html>`

        const rootParsingModel = new HtmlParsingModel({
            items: {
                query: "li",
                multiple: true,
                extractor: extract("innerText")
            }
        })

        const data = await rootParsingModel.parse(html)

        expect(data).toEqual({
            items: [
                "Item A",
                "Item B",
                "Item C",
                "Item D"
            ]
        })
    })

    test("should extract product list from HTML", async () => {
        const html = `<html><body><h1>Items</h1><ul id="products"><li><span class="name">Product 1</span><span class="price">$ 20.00</span></li><li><span class="name">Product 2</span><span class="price">$ 25.00</span></li><li><span class="name">Product 3</span><span class="price">$ 15.90</span></li><li><span class="name">Product 4</span><span class="price">$ 13.80</span></li></ul></body></html>`

        const productParsingModel = new HtmlParsingModel({
            name: {
                query: "span.name",
                extractor: extract("textContent")
            },
            price: {
                query: "span.price",
                extractor: extract("textContent")
            }
        })

        const rootParsingModel = new HtmlParsingModel({
            products: {
                query: "li",
                multiple: true,
                model: productParsingModel
            }
        })

        const data = await await rootParsingModel.parse(html)

        expect(data).toEqual({
            products: [
                {
                    name: "Product 1",
                    price: "$ 20.00"
                },
                {
                    name: "Product 2",
                    price: "$ 25.00"
                },
                {
                    name: "Product 3",
                    price: "$ 15.90"
                },
                {
                    name: "Product 4",
                    price: "$ 13.80"
                },
            ]
        })
    })

    test("should extract user data from HTML", async () => {
        const html = `<html><body><script id="user-data" type="application/json">{ "name": "Marcuth", "username": "marcuth", "age": 19 }</script></body></html>`

        const userParsingModel = new JsonParsingModel({
            username: {
                query: "username"
            },
            name: {
                query: "name"
            },
            age: {
                query: "age"
            }
        })

        const rootParsingModel = new HtmlParsingModel({
            userData: {
                query: "script[type='application/json'][id='user-data']",
                extractor: extract("innerText"),
                model: userParsingModel
            }
        })

        const data = await await rootParsingModel.parse(html)

        expect(data).toEqual({
            userData: {
                username: "marcuth",
                name: "Marcuth",
                age: 19
            }
        })
    })

    test("should return deafult value when extracting a non-existing element", async () => {
        const html = "<html><head></head><body></body></html>"
    
        const rootParsingModel = new HtmlParsingModel({
            missingElement: {
                query: "h1",
                default: null,
                extractor: extract("innerText")
            }
        })
    
        const data = await rootParsingModel.parse(html)
    
        expect(data).toEqual({ missingElement: null })
    })
})
