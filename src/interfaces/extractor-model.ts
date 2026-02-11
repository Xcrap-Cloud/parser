export interface ExtractorModel<T = any> {
    extract(source: string): Promise<T> | T
}
