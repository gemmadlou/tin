import { connection } from "~/src/mysql"


export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [response] = await conn.query(
        'select * from schema_uploads where schema_id = ? and deleted_at is null',
        event.context?.params?.id
    )

    return response
})