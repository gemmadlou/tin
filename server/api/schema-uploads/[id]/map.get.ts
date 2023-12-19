import { connection } from "~/src/mysql"

// @todo dedupe in map/csv.ts
export default defineEventHandler(async (event) => {
    let conn = await connection();

    // @todo use both uuid or id - not just uuid
    let [data] = await conn.query(
        `select * from \`mapped_data\` m
         inner join schema_uploads su
            on su.id = m.schema_uploads_id
            where su.uuid = ?   
        `,
        [event.context?.params?.id]
    )

    return data
        .map(i => ({ ...i, json: JSON.parse(i.json)}))
})