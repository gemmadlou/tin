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
    const response = await conn.execute<{ insertId: number } & RowDataPacket[]>(
        'insert into mappers (config) value (?)',
        [JSON.stringify(parsed.output)]
    )

    return {
        id: response[0].insertId,
        ...body,
    }
})