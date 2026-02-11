import { SourceParser, ExtractionModel } from "../src"
import fs from "node:fs"

jest.mock("node:fs", () => ({
    promises: {
        readFile: jest.fn(),
    },
}))

class MockExtractionModel implements ExtractionModel {
    async extract(source: string): Promise<any> {
        return `Parsed content: ${source}`
    }
}

describe("Parser integration test", () => {
    describe("extractWithModel", () => {
        it("must call the model's extract method with the correct string", async () => {
            const mockModel = new MockExtractionModel()
            const parser = new SourceParser("source-content")

            const extractSpy = jest.spyOn(mockModel, "extract").mockResolvedValue("parsed content")

            const result = await parser.extractWithModel(mockModel)

            expect(extractSpy).toHaveBeenCalledWith("source-content")
            expect(result).toBe("parsed content")
        })
    })

    describe("loadFile", () => {
        const fsReadFileMock = fs.promises.readFile as jest.Mock

        it("should load the file contents correctly and instantiate the Parser", async () => {
            const filePath = "path/to/file.txt"
            const fileContent = "file content"
            const encoding = "utf-8"

            fsReadFileMock.mockResolvedValue(Buffer.from(fileContent, encoding))

            const parserInstance = await SourceParser.loadFile(filePath, { encoding })

            expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, { encoding })
            expect(parserInstance).toBeInstanceOf(SourceParser)
            expect(parserInstance.source).toBe(fileContent)
        })

        it("should use the default encoding value when not specified", async () => {
            const filePath = "path/to/file.txt"
            const fileContent = "file content"

            fsReadFileMock.mockResolvedValue(Buffer.from(fileContent))

            const parserInstance = await SourceParser.loadFile(filePath)

            expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, { encoding: "utf-8" })
            expect(parserInstance.source).toBe(fileContent)
        })
    })
})
