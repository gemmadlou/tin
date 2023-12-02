import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let [response] = await conn.execute(
        'update `schemas` set deleted_at = now() where id = ?',
        [event.context?.params?.id]
    )

    if (!response.changedRow) {
        return
    }

    setResponseStatus(event, 500)

    return {
        error: "Server internal error"
    }
})