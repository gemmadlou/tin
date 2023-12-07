import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [response] = await conn.execute(
        'update `schema_upload_links` set deleted_at = now() where id = ?',
        [event.context?.params?.id]
    )

    return;
})