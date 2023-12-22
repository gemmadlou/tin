export const mapDataHeadingsToSchemaHeadings = (mapperConfig : Record<string, object>, extractedData: Record<string, string|number>) => {
    let mapped : Record<string,  Array<string|number>> = {}

    for (let [schemaHeading, extractedDataHeadings] of Object.entries(mapperConfig)) {
        for (let [i, extractedDataHeading] of Object.entries(extractedDataHeadings)) {
            let mappedField = extractedData[extractedDataHeading]
            mapped[schemaHeading] = mapped[schemaHeading] || []
            mapped[schemaHeading].push(mappedField)
        }
    }

    return mapped;
}