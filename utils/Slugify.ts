export default (input: string): string => {
    return input
        .toLowerCase() // Convert the string to lowercase
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w\-]+/g, '') // Remove non-word characters (excluding hyphens)
        .replace(/\-\-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
        .replace(/^-+/, '') // Remove leading hyphens
        .replace(/-+$/, ''); // Remove trailing hyphens
}
