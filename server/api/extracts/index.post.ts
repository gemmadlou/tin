import { readFile } from "fs/promises"
import { connection } from "~/src/mysql"
import { parse } from 'csv-parse';
import { finished } from "stream/promises";
import * as fs from "fs";

// Read and process the CSV file
const processFile = async (file: string) => {
    let records: string[] = []
    let header: string[] = [];
    const parser = fs
        .createReadStream(file)
        .pipe(parse({
            // CSV options if any
        }));
    parser.on('readable', function () {
        let record; while ((record = parser.read()) !== null) {

            if (header.length === 0) {
                header = record.filter(i => i)
                continue;
            }

            let recordAsObject = record
                .filter(i => i)
                .reduce((obj : Record<string, any>, entry : string, index: number) => {
                    obj[header[index]] = entry;
                    return obj;
                }, {})
                
            records.push(recordAsObject);
        }
    });

    await finished(parser);
    
    return records;
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    let conn = await connection()
    let [uploads, fields] = await conn.query('select * from `uploads` where id = ?', [body.fileId])

    let processed = await processFile(uploads[0].filepath)

    for (let i = 0; i < processed.length; i++) {
        await conn.execute(
            `insert into extracts (row_id, upload_id, json)
            values(?, ?, ?)
            on duplicate key update
                json=?
            `, 
            [i, body.fileId, JSON.stringify(processed[i]),
             JSON.stringify(processed[i])]
        )
    }

    // Delete excess columns
})