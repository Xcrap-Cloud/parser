**Temas para abordar:**
    - HtmlParsingModel
        - query
        - extractor
        - default
        - multiple

    - JsonParsingModel
        - query
    - Nested models
        - model
        - multiple
    - Intercalating models of different types
        - JsonParsingModel with nested HtmlParsingModel
        - HtmlParsing model with nested JsonParsingModel

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
    const parser = await HtmlParser.loadFile("./path-to-html-file.html", { encoding: "utf-8" }) // Returns an instance of HtmlParser
})();

```

### Data extraction without using models

```ts
import { HtmlParser, extract } from "@xcrap/parser"

;(async () => {
    const html = `<html><head><title>Page Title</title></head><body><a href="https://example.com">Link</a></body></html>`
    const parser = new HtmlParser(html)

    // parseFirst() searches and extracts something from the first element found
    // extract(key: string, isAttribute?: boolean) is a generic extraction function, you can use some that are already created and ready to use by importing them from the same location :)
    const title = await parser.parseFirst({ query: "title", extractor: extract("innerText") })

    // parseMany() fetches all the elements it finds with a query (you can limit the number of results) and uses the extractor to grab the data
    const links = await parser.parseMany({ query: "a", extractor: extract("href", true) })

    console.log(title) // "Page Title"
    console.log(links) // ["https://example.com"]
})();
```

### Data extraction with using models

ParsingModels are decoupled enough that you don't have to rely on using Parser instances, but we'll still use them:

```ts
import { HtmlParser, HtmlParsingModel, extract } from "@xcrap/parser"

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

    console.log(data) // { heading: 'Heading', id: '1', name: 'Name', age: '23' }
})();
```

## 🧠 Create your own Parser: Concepts

### What is a Parser?

A Parser for this library is a class that deals in some way with a file type, loads that file, and may or may not have some methods to easily extract data.

A parser has a default method called `parseModel` which is a wrapper that takes a `ParsingModel` and calls the `parse()` method providing the internal `source` property.

### What is a ParsingModel?

A Parsing Model is a class that receives a `shape` in its constructor and stores it as a property. It must have a method called `parse()` that will receive a `source`, which is the code/text that contains the information to be extracted.

This `shape` is used to declare the form in which the information will be extracted from the `source`.

## 🤝 Contributing

- Want to contribute? Follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature-new).
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-new).
- Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.