export interface ExtractionModel<T = any> {
    extract(source: string): Promise<T> | T
}
