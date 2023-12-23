export type DataHeading = string | {
    headingName: string,
    delimitation: {
        delimiter: string,
        delimitedIndex: number
    }
}

export type Mapper = { 
    schemaHeading: string, 
    dataHeadings: DataHeading[]
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

const getDelimitedData = (
    mapper: Mapper,
    dataSet: Set<Data>
) : Mapped => {
    let mapped : Mapped = { schemaHeading: mapper.schemaHeading, dataValues: []}

    mapper.dataHeadings.forEach(dataHeading => {
            if (typeof dataHeading !== "object") {
                return;
            }

            if (!dataHeading.delimitation) {
                return;
            }

            let data : Data | undefined = Array
                .from(dataSet.values())
                .find(data => data.heading === dataHeading.headingName)

            if (!data) return

            let splitted = data.value.toString().split(dataHeading.delimitation.delimiter)
            
            mapped.dataValues.push(splitted[dataHeading.delimitation.delimitedIndex])
        })

    return mapped;
}

export const mapDataValuesToSchemaHeadings = (
    mapperSet : Set<Mapper>, 
    dataSet: Set<Data>
) 
: Mapped[] => 
    Array.from(mapperSet.values())
        .map(mapper => {
            let mapped = getMappedData(mapper, dataSet)
            let delimited = getDelimitedData(mapper, dataSet)
        
            mapped.dataValues.push(...delimited.dataValues)

            return mapped
        })