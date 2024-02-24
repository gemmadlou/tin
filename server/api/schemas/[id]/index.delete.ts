import { db } from "~/src/sqlite";

export default defineEventHandler(async (event) => {

    let sql = 'update `schemas` set deleted_at = DateTime(\'now\') where id = ? and deleted_at is null';
    let args = [event.context?.params?.id || null]
    let res = await db().execute({ sql, args })

    if (res.rowsAffected === 0) {
        setResponseStatus(event, 404);
        return
    }

    setResponseStatus(event, 204)
    return
})