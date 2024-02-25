import { db, transformData } from "~/src/sqlite";

export default defineEventHandler(async (evnet) => {
    let sql = 'select * from `schemas` where deleted_at is null';
    let res = await db().execute({ sql, args: [] })

    let data = transformData<any>(res)

    return data.map((row) => {
        return {
            ...row,
            json: JSON.parse(row.json)
        }
    })
})