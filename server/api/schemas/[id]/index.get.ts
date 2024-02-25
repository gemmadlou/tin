import { db, transformData } from "~/src/sqlite";

export default defineEventHandler(async (event) => {
    // Should always be defined but we have to do this for now
    // due to type errors saying it's possibly undefined
    // @todo fix when fixed or try to offer PR
    // https://github.com/nuxt/nuxt/issues/19871
    if (!event.context.params?.id) {
        setResponseStatus(event, 500)
        return { error: "Internal server error" }
    }

    let sql = 'select * from `schemas` where id = ?';
    let args = [event.context.params?.id]
    let res = await db().execute({ sql, args })

    if (res.rows.length === 0) {
        setResponseStatus(event, 404)
        return
    }
    
    let data = transformData<any>(res)[0]

    return {
        ...data,
        json: JSON.parse(data.json)
    }
})