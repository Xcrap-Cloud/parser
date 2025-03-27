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
    const parser = HtmlParser.loadFile("./path-to-html-file.html", { encoding: "utf-8" })

    const title = await parser.parseFirst({ query: "title", extractor: extract("innerText") })
    const links = await parser.parseMany({ query: "a", extractor: extract("href", true) })

    console.log({ title, links })
})();

```

Running this code, you should see something like this:

```js
{
    title: "Page Title",
    links: ["https://example.com/page1", "https://example.com/page2"]
}
```