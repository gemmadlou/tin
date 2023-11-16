import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let response = await conn.query(
        'select * from `schemas` where id = ?',
        event.context?.params?.id
    )

    return {
        ...response[0][0],
        json: JSON.parse(response[0][0].json)
    }
})