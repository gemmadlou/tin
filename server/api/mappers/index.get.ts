import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [data, fields] = await conn.query(
        'select * from `mappers`'
    )

    return data.map(i => ({ ...i, mapper_config: JSON.parse(i.mapper_config)}))
})