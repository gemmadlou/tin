import { connection } from "~/src/mysql"

const UUID_REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

const isUuid = (uuid : unknown) => typeof uuid === 'string' && UUID_REGEX.test(uuid);

export default defineEventHandler(async (event) => {
    let conn = await connection()

    let response;

    if (isUuid(event.context?.params?.id)) {
        [response] = await conn.query(
            'select * from `schema_upload_links` where uuid = ?',
            [event.context?.params?.id]
        )
    } else {
        [response] = await conn.query(
            'select * from `schema_upload_links` where id = ?',
            [event.context?.params?.id]
        )
    }

    return response[0]
})