import { writeFile } from 'fs/promises';
import path from 'path';
import { connection } from "~/src/mysql"

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event)

    let i = 0
    if (!files || files.length === 0) {
        setResponseStatus(event, 400)
        return {
            error: 'No file received'
        }
    }

    const filename = files[i].filename;
    const mimetype = files[i].type;
    const data = files[i].data;

    const filePath = path.resolve(process.cwd(), `./.files/${crypto.randomUUID()}.${mimetype?.split('/').pop()}`);

    await writeFile(filePath, data);

    let conn = await connection()

    let response = await conn.query(
        'insert into `uploads` (filename, filepath) values(?, ?)',
        [filename, filePath]
    )

    return {
        id: response[0].insertId,
        filename,
        mimetype,
        filePath
    }
})