# 🕷️ Xcrap Parser: Parsing HTML and JSON using declarative models

Xcrap Parser is a package of the Xcrap framework, it was developed to take care of the data extraction part of text files (currently supporting only HTML and JSON) using declarative models.

---

## 📦 Installation

Installing it is very simple, you can use NPM or any other package manager of your choice: such as PNPM, Yarn, etc.

```cmd
npm i @xcrap/parser
```

---

## 🛠️ How to Use

Well, there are a few ways to use this parsing mechanism, from using the already created templates to expanding it by creating parsers for other file types and keeping the interleaving of these templates.

### Providing HTML string

```ts
import { HtmlParser, extract } from "@xcrap/parser"

;(async () => {
    const html = "<html><head><title>Page Title</title></head><body><><></body></html>"
    const parser = new HtmlParser(html)
})();
```

### Loading an HTML file

```ts
import { HtmlParser, extract } from "@xcrap/parser"

;(async () => {
    const parser = HtmlParser.loadFile("./path-to-html-file.html", { encoding: "utf-8" }) // Returns an instance of HtmlParser
})();

```

### Data extraction without using models

```ts
// Assuming you have already instantiated the HtmlParser
// parseFirst() searches and extracts something from the first element found
// extract() is a generic extraction function, you can use some that are already created and ready to use by importing them from the same location :)
const title = await parser.parseFirst({ query: "title", extractor: extract("innerText") })

// parseMany() fetches all the elements it finds with a query (you can limit the number of results) and uses the extractor to grab the data
const links = await parser.parseMany({ query: "a", extractor: extract("href", true) })
```

### Data extraction with using models

ParsingModels are decoupled enough that you don't have to rely on using Parser instances, but we'll still use them:

```ts
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
```

Running this code, you should get the following result:

```js
{ heading: 'Heading', id: '1', name: 'Name', age: '23' }
```

**Temas para abordar:**
- ParsingModel Concept
    - Query
    - Extractor
    - Model field default values
    - Getting result as array of objects
    - Nested models
    - Intercalating models of different types

