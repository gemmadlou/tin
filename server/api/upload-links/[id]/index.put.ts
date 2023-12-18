import { randomUUID } from "crypto";
import { z } from "zod";
import { connection } from "~/src/mysql"

const UpdateSchemaUploadLink = z.object({
    name: z.string(),
    upload_id: z.number().int().positive().nullable(),
    mapper_id: z.number().int().positive().nullable()
})

export default defineEventHandler(async (event) => {
    const conn = await connection();

    const body = await readBody<typeof UpdateSchemaUploadLink>(event)

    let validated = UpdateSchemaUploadLink.safeParse(body)

    if (!validated.success) {
        setResponseStatus(event, 400)
        return validated.error.flatten();
    }

    let [response] = await conn.execute(
        'update schema_uploads set name=?, upload_id=?, mapper_id=? where id = ?',
        [
            validated.data.name,
            validated.data.upload_id, 
            validated.data.mapper_id,
            event.context.params?.id
        ]
    )

    return
})