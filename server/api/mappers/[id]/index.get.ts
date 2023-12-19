import { connection } from "~/src/mysql"


// @todo dedupe in map/csv.ts
export default defineEventHandler(async (event) => {
    let conn = await connection();

    let [data] = await conn.query(
        'select * from `mappers` where id = ?',
        [event.context?.params?.id]
    )

    return {
       ...data[0],
       config: JSON.parse(data[0].config)
    }
})