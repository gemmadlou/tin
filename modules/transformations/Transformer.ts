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

const getMappedData = (
    mapper: Mapper,
    dataSet: Set<Data>
) : Mapped => {
    let mapped : Mapped = { schemaHeading: mapper.schemaHeading, dataValues: []}

    mapper.dataHeadings.forEach(dataHeading => {
        let data : Data | undefined = Array
            .from(dataSet.values())
            .find(data => data.heading === dataHeading)

        if (!data) return

        mapped.dataValues.push(data.value)
    })

    return mapped
}

export const mapDataValuesToSchemaHeadings = (
    mapperSet : Set<Mapper>, 
    dataSet: Set<Data>
) 
: Mapped[] => 
    Array.from(mapperSet.values())
        .map(mapper => getMappedData(mapper, dataSet))