import { db, transformData } from "~/src/sqlite";



export default defineEventHandler(async (event) => {
    let sql = 'select * from `schemas` where id = ?';
    let args = [event.context.params?.id ?? -1]

    let res = await db().execute({ sql, args })

    if (res.rows.length === 0) {
        setResponseStatus(event, 404)
        return
    }
    
    let data = transformData(res)[0]

    return {
        ...data,
        json: JSON.parse(data.json)
    }
})