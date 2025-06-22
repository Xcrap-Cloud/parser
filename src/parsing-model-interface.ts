export interface ParsingModel {
    parse(source: string, ...args: any[]): Promise<any> | any
}