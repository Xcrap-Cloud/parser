export function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/(^-+|-+$)/g, "")
        .trim()
}