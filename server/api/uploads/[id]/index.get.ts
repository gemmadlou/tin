import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [response] = await conn.query(
        'select * from `uploads` where id = ?',
        [event.context?.params?.id]
    )

    return response[0]
})