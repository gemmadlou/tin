import { randomUUID } from "crypto";
import { z } from "zod";
import { connection } from "~/src/mysql"

const UpdateSchemaUploadLink = z.object({
    name: z.string()
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
        'update schema_upload_links set name=? where id = ?',
        [validated.data.name, event.context.params?.id]
    )

    return
})