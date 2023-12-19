import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [data, fields] = await conn.query(
        'select * from `mappers`'
    )

    return data.map(i => ({ ...i, config: JSON.parse(i.config)}))
})