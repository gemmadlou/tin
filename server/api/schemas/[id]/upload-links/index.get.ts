import { connection } from "~/src/mysql"


export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [response] = await conn.query(
        'select * from schema_upload_links where schema_id = ?',
        event.context?.params?.id
    )

    return response
})