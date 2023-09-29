import { connection } from "~/src/mysql"

export default defineEventHandler(async () => {
    let conn = await connection()

    let response = await conn.query(
        'select * from `schema`'
    )

    let schemes = JSON.parse(JSON.stringify(response[0]))
    return schemes
})