const typescript = require("@rollup/plugin-typescript")
const resolve = require("@rollup/plugin-node-resolve")
const commonjs =  require("@rollup/plugin-commonjs")
const path = require("node:path")
const fs = require("node:fs")

function getAllTypeScriptFiles(dir) {
    let files = []

    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file)

        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(getAllTypeScriptFiles(fullPath))
        } else if (file.endsWith(".ts")) {
            files.push(fullPath)
        }
    })

    return files
}

const inputFiles = getAllTypeScriptFiles("src")

module.exports = [
    {
        input: inputFiles,
        output: {
            dir: "dist",
            format: "cjs",
            entryFileNames: "[name].cjs",
            preserveModules: true,
        },
        plugins: [resolve(), commonjs(), typescript()]
    },
    {
        input: inputFiles,
        output: {
            dir: "dist",
            format: "esm",
            entryFileNames: "[name].mjs",
            preserveModules: true,
        },
        plugins: [resolve(), commonjs(), typescript()]
    }
]