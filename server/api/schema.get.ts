import { connection } from "~/src/mysql"

export default defineEventHandler(async () => {
    let conn = await connection()

    let response = await conn.query(
        'select * from `schema`'
    )

    // console.log(JSON.parse(JSON.parse(json).data));)
    console.log(JSON.stringify(response[0]).replace(/\\/g, ""))
    let schemes = JSON.parse(JSON.stringify(response[0]))
    return schemes
})