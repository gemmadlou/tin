import { connection } from "~/src/mysql"

type Body = {
    schema_id: number,
    upload_id: number,
    mapper_config: object
}

export default defineEventHandler(async (event) => {
    const body = await readBody<Body>(event)

    let conn = await connection()
    const response = await conn.execute(
        'insert into mappers (schema_id, upload_id, mapper_config) value (?,?,?)',
        [body.schema_id, body.upload_id, JSON.stringify(body.mapper_config)]
    )

    return {
        id: response[0].insertId,
        ...body,
    }
})