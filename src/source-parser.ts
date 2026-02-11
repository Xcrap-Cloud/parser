import { Abortable } from "node:events"
import fs, { OpenMode } from "node:fs"

import { ExtractionModel } from "./interfaces/extraction-model"

export type SourceParserLoadFileOptions =
    | ({
          encoding?: BufferEncoding | null
          flag?: OpenMode
      } & Abortable)
    | null

export class SourceParser {
    constructor(readonly source: string) {}

    async extractWithModel<T>(extractionModel: ExtractionModel<T>): Promise<T> {
        return await extractionModel.extract(this.source)
    }

    static async loadFile<T extends typeof SourceParser>(
        this: T,
        path: string,
        options: SourceParserLoadFileOptions = {
            encoding: "utf-8",
        },
    ): Promise<InstanceType<T>> {
        const fileContent = await fs.promises.readFile(path, options)
        return Reflect.construct(this, [fileContent.toString()]) as InstanceType<T>
    }
}
