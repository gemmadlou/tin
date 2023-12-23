export type Mapper = { 
    schemaHeading: string, 
    dataHeadings: string[]
}

export type Data = { 
    dataHeading: string, 
    dataValue: string | number
}

export const mapDataHeadingsToSchemaHeadings = (
    mapperSet : Set<Mapper>, 
    dataSet: Set<Data>
) => {
    let mapped : Record<string,  Array<string|number>> = {}
    
    for (let mapper of Array.from(mapperSet.values())) {

        for (let dataHeading of mapper.dataHeadings) {
            let mappedField = Array.from(dataSet.values()).find(data => data.dataHeading === dataHeading)

            if (!mappedField) continue
    
            mapped[mapper.schemaHeading] = mapped[mapper.schemaHeading] || []
            mapped[mapper.schemaHeading].push(mappedField.dataValue)
        }
    }

    return mapped;
}