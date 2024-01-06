import { format } from "date-fns"
import { z } from "zod"
import { Data, Mapper, mapDataValuesToSchemaHeadings } from "~/modules/transformations/Transformer"
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

    let dataRows: Data[][] = extracts
        .map(i => JSON.parse(i.json))
        .map(i => Object.entries(i).map(([heading, value]) => ({ heading, value })))

    let mappedList = []
    for (let i in dataRows) {
        let dataRow = dataRows[i]
        // console.log(dataRow)
        // return
        let mapped = mapDataValuesToSchemaHeadings(mapper.config, dataRow)
        mappedList.push(mapped)

        await conn.execute(
            `insert into mapped_data
            (schema_uploads_id, row_id, json)
            values(?,?,?)
            on duplicate key update
                json=?
            ;`,
            [
                event.context?.params?.id, i, JSON.stringify(mapped),
                JSON.stringify(mapped)
            ]
        )
    }

    return mappedList
})