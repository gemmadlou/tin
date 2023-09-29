import { connection } from "~/src/mysql"

export default defineEventHandler(async () => {
    let conn = await connection()

    let response = await conn.query(
        'select * from `uploads`'
    )

    let uploads = JSON.parse(JSON.stringify(response[0]))
    return uploads
})