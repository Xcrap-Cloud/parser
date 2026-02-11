# 🕷️ Xcrap Extractor: Parsing HTML and JSON using declarative models

> Note: Xcrap Parser is now Xcrap Extractor

Xcrap Extractor is a package of the Xcrap framework, it was developed to take care of the data extraction part of text files (currently supporting only HTML, JSON and Markdown) using declarative models.

---

## 📦 Installation

Installing it is very simple, you can use NPM or any other package manager of your choice: such as PNPM, Yarn, etc.

```cmd
npm i @xcrap/extractor
```

---

## 🛠️ How to Use

Well, there are a few ways to use this parsing mechanism, from using the already created templates to expanding it by creating parsers for other file types and keeping the interleaving of these templates.

### Providing HTML string

```ts
import { HtmlParser, extract } from "@xcrap/extractor"

;(async () => {
    const html = "<html><head><title>Page Title</title></head><body><><></body></html>"
    const parser = new HtmlParser(html)
})();
```

### Loading an HTML file

```ts
import { HtmlParser, extract } from "@xcrap/extractor"

;(async () => {
    const parser = await HtmlParser.loadFile("./path-to-html-file.html", { encoding: "utf-8" }) // Returns an instance of HtmlParser
})();

```

### Data extraction without using models

```ts
import { HtmlParser, extract, css } from "@xcrap/extractor"

;(async () => {
    const html = `<html><head><title>Page Title</title></head><body><a href="https://example.com">Link</a></body></html>`
    const parser = new HtmlParser(html)

    // extractValue() searches and extracts something from the first element found
    // extract(key: string, isAttribute?: boolean) is a generic extraction function, you can use some that are already created and ready to use by importing them from the same location :)
    const title = await parser.extractValue({ query: css("title"), extractor: extract("innerText") })

    // extractValues() fetches all the elements it finds with a query (you can limit the number of results) and uses the extractor to grab the data
    const links = await parser.extractValues({ query: css("a"), extractor: extract("href", true) })

    console.log(title) // "Page Title"
    console.log(links) // ["https://example.com"]
})();
```

### Data extraction with using models

ExtractorModels are decoupled enough that you don't have to rely on using SourceParser instances, but we'll still use them:

```ts
import { HtmlParser, HtmlExtrctorModel, extract, css } from "@xcrap/extractor"

;(async () => {
    const html = `<html><body><h1>Heading</h1><div><p id="id">1</p><p id="name">Name</p><p class="age">23</p></div></body></html>`
    const parser = new HtmlParser(html)

    const rootModel = new HtmlExtrctorModel({
        heading: {
            query: css("h1"),
            extractor: extract("innerText")
        },
        id: {
            // You can also use xpath() query builder
            // query: xpath("//*[@id='id']")
            query: css("#id"),
            extractor: extract("innerText")
        },
        name: {
            query: css("#name"),
            extractor: extract("innerText")
        },
        age: {
            query: css(".age"),
            extractor: extract("innerText")
        }
    })

    const data = await parser.extractModel({ model: rootModel })

    console.log(data) // { heading: "Heading", id: "1", name: "Name", age: "23" }
})();
```

## 🧠 Create your own Parser: Concepts

### What is a SourceParser?

A SourceParser for this library is a class that deals in some way with a file type, loads that file, and may or may not have some methods to easily extract data.

A parser has a default method called `extractWithModel` which is a wrapper that takes a `ExtractorModel` and calls the `extract()` method providing the internal `source` property.

### What is a ExtractorModel?

A Extractor Model is a class that receives a `shape` in its constructor and stores it as a property. It must have a method called `extract()` that will receive a `source`, which is the code/text that contains the information to be extracted.

This `shape` is used to declare the form in which the information will be extracted from the `source`.

## 🤝 Contributing

**We are actively looking for contributors!** Whether you are a beginner or an experienced developer, your help is welcome. We have many tasks available, from simple documentation fixes to complex parser implementations.

- Want to contribute? Follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature-new).
- Commit your changes (git commit -m 'Add new feature').
- Push to the branch (git push origin feature-new).
- Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.