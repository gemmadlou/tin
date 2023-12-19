import { format } from "date-fns"
import { z } from "zod"
import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {

    let conn = await connection()

    let [schemaUploads] = await conn.query(
        `select
            m.config as mapperConfig,
            s.json as schemaConfig,
            su.upload_id as uploadId,
            su.schema_id as schemaId,
            su.mapper_id as mapperId
        from schema_uploads su
        inner join mappers m
            on m.id = su.mapper_id
        inner join \`schemas\` s
            on s.id = su.schema_id
        where su.id = ?`,
        event.context?.params?.id
    )

    schemaUploads = schemaUploads[0]

    let mapperConfig = JSON.parse(schemaUploads.mapperConfig)
    let schemaConfig = JSON.parse(schemaUploads.schemaConfig)

    let mapper = {
        config: mapperConfig
    }

    let [extracts] = await conn.query(
        'select * from extracts where upload_id = ?',
        [schemaUploads.uploadId]
    )

    extracts = extracts
        .map(i => JSON.parse(i.json))

    // For each uploaded row of data, convert into the schema
    for (let i = 0; i < extracts.length; i++) {
        let uploadDataRow = extracts[i]
        let mapped = Object.entries(mapper.config)
            .reduce((obj : Record<string, any>, [key, value]) => {
                obj[key] = value.map(val => {
                    // Get data from uploaded data row
                    let lookupValue = uploadDataRow[val] || '';

                    // Transform data: Trim
                    lookupValue = lookupValue.trim()

                    // Transform data: Dates
                    if (schemaConfig.properties[key]?.format) {
                        try {
                            lookupValue = format(new Date(lookupValue), 'yyyy-MM-dd')
                        } catch {
                            console.info(`Row ${i + 1}: Incorrect date format ${lookupValue}`)
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
                schemaUploads.mapperId, i, JSON.stringify(mapped),
                JSON.stringify(mapped)
            ]
        )
    }

    return
})