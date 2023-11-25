import { connection } from "~/src/mysql"

type Body = {
    mapper_id: number,
    row_id: number,
    json: number
}

export default defineEventHandler(async (event) => {
    let conn = await connection()
    let body = await readBody<Body>(event)

    let response = await conn.execute(
        `insert into mapped_data
        (mapper_id, row_id, json)
        values(?,?,?)
        on duplicate key update
            json=?
        ;`,
        [
            body.mapper_id, body.row_id, JSON.stringify(body.json),
            JSON.stringify(body.json)
        ]
    )

    return {
        id: response[0].insertId,
        ...body,
    }
})