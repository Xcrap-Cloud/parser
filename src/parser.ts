import { Abortable } from "node:events"
import fs, { OpenMode } from "node:fs"

import { ParsingModel } from "./parsing-model-interface"

export type ParserLoadFileOptions = (
    {
        encoding?: BufferEncoding | null
        flag?: OpenMode
    } & Abortable
        )  | null

export class Parser {
    constructor(readonly source: string) {}

    async parseModel(parsingModel: ParsingModel) {
        return await parsingModel.parse(this.source)
    }

    static async loadFile<T extends typeof Parser>(
        this: T,
        path: string,
        options: ParserLoadFileOptions = {
            encoding: "utf-8"
        }
    ): Promise<InstanceType<T>> {
        const fileContent = await fs.promises.readFile(path, options)
        return Reflect.construct(this, [fileContent.toString()]) as InstanceType<T>
    }
}