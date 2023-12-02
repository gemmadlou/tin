import { connection } from "~/src/mysql"


export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {
        let conn = await connection()
        let response = await conn.execute(
            'insert into `schemas` (name, json) values (?, ?)',
            [body.name, body.json]
        )

        return {
            id: response[0].insertId,
            ...body,
        }

    } catch (error) {
        console.log({ error })
        setResponseStatus(event, 500)
        return {
            error: 'Internal server error'
        }
    }
})