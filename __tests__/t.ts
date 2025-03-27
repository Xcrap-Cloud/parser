import { HtmlParser, HtmlParsingModel, extract } from "../src"

;(async () => {
    const html = `<html><body><h1>Heading</h1><div><p id="id">1</p><p id="name">Name</p><p class="age">23</p></div></body></html>`
    const parser = new HtmlParser(html)

    const rootParsingModel = new HtmlParsingModel({
        heading: {
            query: "h1",
            extractor: extract("innerText")
        },
        id: {
            query: "#id",
            extractor: extract("innerText")
        },
        name: {
            query: "#name",
            extractor: extract("innerText")
        },
        age: {
            query: ".age",
            extractor: extract("innerText")
        }
    })

    const data = await parser.extractFirst({ model: rootParsingModel })

    console.log(data)
})();