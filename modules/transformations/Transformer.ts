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

const transformDelimitedData = (
    dataHeading: DataHeading,
    data: Data
): (string | number | undefined) => {
    if (typeof dataHeading !== "object") {
        return;
    }
    
    if (!dataHeading.delimitation) {
        return;
    }

    let splitted = data.value.toString().split(dataHeading.delimitation.delimiter)
    return splitted[dataHeading.delimitation.delimitedIndex]
}

const getMappedData = (
    mapper: Mapper,
    dataSet: Set<Data>
): Mapped => {
    let mapped: Mapped = { schemaHeading: mapper.schemaHeading, dataValues: [] }

    mapper.dataHeadings.forEach(dataHeading => {
        let data: Data | undefined = Array
            .from(dataSet.values())
            .find(data =>
                typeof dataHeading === "object"
                    ? data.heading === dataHeading.headingName
                    : data.heading === dataHeading
            )

        if (!data) return

        let delimitedMapped = transformDelimitedData(dataHeading, data)
        if (delimitedMapped) {
            mapped.dataValues.push(delimitedMapped)
            return
        }

        mapped.dataValues.push(data.value)
    })

    return mapped
}

const trimFields = (
    mapped: Mapped
) => {
    mapped.dataValues = mapped.dataValues
        .map(value => {
            if (typeof value === "string") {
                return value.toString().trim()
            }
            return value
        })

    return mapped
}

export const mapDataValuesToSchemaHeadings = (
    mapperSet: Set<Mapper>,
    dataSet: Set<Data>
)
    : Mapped[] =>
    Array.from(mapperSet.values())
        .map(mapper => getMappedData(mapper, dataSet))
        .map(trimFields)