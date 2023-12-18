import { connection } from "~/src/mysql"

type Body = {
    config: object
}

export default defineEventHandler(async (event) => {
    const body = await readBody<Body>(event)

    let conn = await connection()
    const response = await conn.execute(
        'insert into mappers (mapper_config) value (?)',
        [JSON.stringify(body.config)]
    )

    return {
        id: response[0].insertId,
        ...body,
    }
})