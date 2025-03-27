export interface ParsingModel {
    parse(source: string): Promise<any> | any
}