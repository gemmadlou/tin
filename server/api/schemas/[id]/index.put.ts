import { z } from "zod";
import { connection } from "~/src/mysql"

const UpdateSchemaRequest = z.object({
    id: z.number(),
    name: z.string().min(1).trim(),
    json: z.string().min(3).trim()
})

export default defineEventHandler(async (event) => {
    const body = await readBody<typeof UpdateSchemaRequest>(event)

    let validated = UpdateSchemaRequest.safeParse(body)

    if (!validated.success) {
        setResponseStatus(event, 400)
        return validated.error.flatten();
    }

    try {
        let conn = await connection()
        let response = await conn.execute(
            `update \`schemas\`
                set name=?, json=?
                where id = ?
            ;`,
            [validated.data.name, validated.data.json, validated.data.id]
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