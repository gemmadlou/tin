import { connection } from "~/src/mysql"


export default defineEventHandler(async (event) => {
    let conn = await connection();

    let [data] = await conn.query(
        'select * from `mapped_data` where mapper_id = ?',
        [event.context?.params?.id]
    )

    return data
        .map(i => ({ ...i, json: JSON.parse(i.json)}))
})