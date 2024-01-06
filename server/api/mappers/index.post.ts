import { connection } from "~/src/mysql"
import { mapper } from "../../../modules/transformations/Transformer"
import { array, flatten, object, parse, safeParse } from "valibot"
import exp from "constants"
import { RowDataPacket } from "mysql2"

let expectedBody = object({
    config: array(mapper)
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = safeParse(expectedBody, body)
    if (!parsed.success) {
        return flatten<typeof expectedBody>(parsed.issues);
    }
    
    let conn = await connection()
    const insert = await conn.execute<{ insertId: number } & RowDataPacket[]>(
        'insert ignore into mappers (config) value (?)',
        [JSON.stringify(parsed.output.config)]
    )

    // Newly created
    if (insert[0].insertId !== 0) {
        return {
            id: insert[0].insertId,
            ...body,
        }
    }

    // Get previous
    const [query] = await conn.query<{ id: number }[] & RowDataPacket[]>(
        'select * from mappers where hashed = md5(?)',
        [JSON.stringify(parsed.output.config)]
    )

    return {
        id: query[0].id,
        ...body
    }
    
})