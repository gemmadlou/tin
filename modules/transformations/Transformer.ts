import { format } from "date-fns"
import { literal, number, object, optional, string, type Input, union } from "valibot"

const headingString = string()

const headingStatic = object({
    static: string()
})

const headingObject = object({
    headingName: string(),
    delimitation: optional(
        object({
            delimiter: string(),
            delimitedIndex: number()
        })
    ),
    format: optional(
        literal("date")
    )
})

export const dataHeading = union([headingString, headingStatic, headingObject]);

export type DataHeading = Input<typeof dataHeading>

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
        return;
    }

    mapped.dataValues.push(mapValue(dataHeading, dataHeading.static))

    return { ...mapped }
}

const transformObjectMaps = (
    dataHeading: DataHeading,
    data: Data,
    mapped: Mapped
) : Mapped | undefined => {

    mapped.dataValues.push(mapValue(dataHeading, data.value))

    return { ...mapped }
}

const transformSimpleMaps = (
    dataHeading: DataHeading,
    data: Data,
    mapped: Mapped
) : Mapped | undefined => {

    mapped.dataValues.push(mapValue(dataHeading, data.value))

    return { ...mapped };
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

        if (data && typeof dataHeading === "object" && "delimitation" in dataHeading) {
            mapped = transformDelimitedData(dataHeading, data, mapped) ?? mapped
        } else if (typeof dataHeading === "object" && "static" in dataHeading) {
            mapped = transformStaticValue(dataHeading, mapped) ?? mapped
        } else if (data && typeof dataHeading === "string") {
            mapped = transformSimpleMaps(dataHeading, data, mapped) ?? mapped
        } else if (data && typeof dataHeading === "object") {
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