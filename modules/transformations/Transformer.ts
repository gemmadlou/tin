export type Mapper = { 
    schemaHeading: string, 
    dataHeadings: string[]
}

export type Data = { 
    heading: string, 
    value: string | number
}

export type Mapped = {
    schemaHeading: string,
    dataValues: (string | number)[]
}

export const mapDataHeadingsToSchemaHeadings = (
    mapperSet : Set<Mapper>, 
    dataSet: Set<Data>
)
: Mapped[] => {
    let mapped : Mapped[] = []
    
    for (let mapper of Array.from(mapperSet.values())) {

        let mappedItem : Mapped 
            = mapped.find(mapping => mapping.schemaHeading === mapper.schemaHeading) 
                || { schemaHeading: mapper.schemaHeading, dataValues: []}

        for (let dataHeading of mapper.dataHeadings) {
            let data = Array
                .from(dataSet.values())
                .find(data => data.heading === dataHeading)

            if (!data) continue

            mappedItem.dataValues.push(data.value)
        }

        mapped.push(mappedItem)
    }

    return mapped;
}