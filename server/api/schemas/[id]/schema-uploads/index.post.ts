import { randomUUID } from "crypto";
import { z } from "zod";
import { connection } from "~/src/mysql"

const CreateSchemaUploadLink = z.object({
    name: z.string()
})

export default defineEventHandler(async (event) => {
    const conn = await connection();

    const body = await readBody<typeof CreateSchemaUploadLink>(event)

    let validated = CreateSchemaUploadLink.safeParse(body)

    if (!validated.success) {
        setResponseStatus(event, 400)
        return validated.error.flatten();
    }

    let uuid = randomUUID();

    let [response] = await conn.execute(
        'insert into schema_uploads (schema_id, uuid, name) values (?, ?, ?)',
        [event.context?.params?.id, uuid, validated.data.name]
    )

    return {
        id: response.id,
        uuid,
        ...validated
    }
})