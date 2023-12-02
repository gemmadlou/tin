import { format } from "date-fns"
import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {

    let conn = await connection()

    let [mapper] = await conn.query(
        'select * from mappers where id = ?',
        event.context?.params?.id
    )

    mapper = {
        ...mapper[0],
        mapper_config: JSON.parse(mapper[0].mapper_config)
    }

    let [schema] = await conn.query(
        'select * from `schemas` where id = ?',
        mapper.schema_id
    )
    let schemaJson = JSON.parse(schema[0].json)

    let [extracts] = await conn.query(
        'select * from extracts where file_id = ?',
        [mapper.upload_id]
    )

    extracts = extracts
        .map(i => JSON.parse(i.json))

    // For each uploaded row of data, convert into the schema
    for (let i = 0; i < extracts.length; i++) {
        let uploadDataRow = extracts[i]
        let mapped = Object.entries(mapper.mapper_config)
            .reduce((obj : Record<string, any>, [key, value]) => {
                obj[key] = value.map(val => {
                    // Get data from uploaded data row
                    let lookupValue = uploadDataRow[val] || '';

                    // Transform data: Dates
                    if (schemaJson.properties[key]?.format) {
                        try {
                            lookupValue = format(new Date(lookupValue), 'yyyy-MM-dd')
                        } catch {
                            console.log(`Row ${i + 1}: Incorrect date format ${lookupValue}`)
                            lookupValue = ""
                        }
                    }

                    return lookupValue
                })
                return obj
            }, {})


        await conn.execute(
            `insert into mapped_data
            (mapper_id, row_id, json)
            values(?,?,?)
            on duplicate key update
                json=?
            ;`,
            [
                mapper.id, i, JSON.stringify(mapped),
                JSON.stringify(mapped)
            ]
        )
    }

    return
})