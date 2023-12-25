import { format } from "date-fns"

export type Format = "date"

export type DataHeading = string | {
    headingName: string,
    delimitation?: {
        delimiter: string,
        delimitedIndex: number
    },
    format?: Format
} | {
    static: string
} | {
    headingName: string,
    format?: Format
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

const mapValue = (
    dataHeading: DataHeading,
    value: string | number
) : string | number => {

    if (typeof dataHeading === "object" && "format" in dataHeading && dataHeading.format === "date") {
        return format(new Date(value), 'yyyy-MM-dd')
    }

    return value;
}

const transformDelimitedData = (
    dataHeading: DataHeading,
    data: Data,
    mapped: Mapped
): Mapped | undefined => {
    if (!(typeof dataHeading === "object" && "delimitation" in dataHeading && dataHeading.delimitation)) {
        return;
    }

    let splitted = data.value.toString().split(dataHeading.delimitation.delimiter)
    let value = mapValue(dataHeading, splitted[dataHeading.delimitation.delimitedIndex])
    mapped.dataValues.push(value)

    return mapped
}

const transformStaticValue = (
    dataHeading: DataHeading,
    mapped: Mapped
) : Mapped | undefined => {
    if (!(typeof dataHeading === "object" && "static" in dataHeading)) {
        return
    }

    mapped.dataValues.push(mapValue(dataHeading, dataHeading.static))

    return { ...mapped }
}

const transformObjectMaps = (
    dataHeading: DataHeading,
    data: Data,
    mapped: Mapped
) : Mapped | undefined => {
    if (typeof dataHeading === "object" && "headingName" in dataHeading) {
        mapped.dataValues.push(mapValue(dataHeading, data.value))
        return { ...mapped }
    }
}

const transformSimpleMaps = (
    dataHeading: DataHeading,
    data: Data,
    mapped: Mapped
) : Mapped | undefined => {
    if (!(typeof dataHeading === "string")) {
        return
    }

    mapped.dataValues.push(mapValue(dataHeading, data.value))

    return { ...mapped };
}

const enum Processor { STATIC, DELIMITED, SIMPLE, OBJECT }

const processOrder = (
    dataHeading: DataHeading
) : Processor => {
    switch (true) {
        case typeof dataHeading === "string":
            return Processor.SIMPLE
        case (typeof dataHeading === "object" && "delimitation" in dataHeading):
            return Processor.DELIMITED
        case (typeof dataHeading === "object" && "static" in dataHeading):
            return Processor.STATIC
        case (typeof dataHeading === "object"):
            return Processor.OBJECT
        default:
            throw new Error("cannot process this header")
    }
}

const getMappedData = (
    mapper: Mapper,
    dataSet: Set<Data>
): Mapped => {
    let mapped: Mapped = { schemaHeading: mapper.schemaHeading, dataValues: [] }

    mapper.dataHeadings.forEach(dataHeading => {
        let data: Data | undefined = Array
            .from(dataSet.values())
            .find(data => {
                if (typeof dataHeading === "object" && "headingName" in dataHeading) {
                    return data.heading === dataHeading.headingName
                }

                return data.heading === dataHeading;
            })

        if (data && processOrder(dataHeading) === Processor.DELIMITED) {
            mapped = transformDelimitedData(dataHeading, data, mapped) ?? mapped
        } else if (processOrder(dataHeading) === Processor.STATIC) {
            mapped = transformStaticValue(dataHeading, mapped) ?? mapped
        } else if (data && processOrder(dataHeading) === Processor.SIMPLE) {
            mapped = transformSimpleMaps(dataHeading, data, mapped) ?? mapped
        } else if (data && processOrder(dataHeading) === Processor.OBJECT) {
            mapped = transformObjectMaps(dataHeading, data, mapped) ?? mapped
        }   
        
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