import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    let conn = await connection()
    
    let [data, fields] = await conn.query(
        'select * from `extracts` where upload_id = ?',
        event.context?.params?.id
    )

    return data.map((i) => ({
        ...i,
        json: JSON.parse(i.json)
    }))
})