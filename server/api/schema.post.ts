import mysql, { ConnectionOptions } from 'mysql2/promise';

const access: ConnectionOptions = {
    user: 'root',
    database: 'tin',
    host: '0.0.0.0',
    port: 30066,
    password: 'tin'
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    
    const connection = await mysql.createConnection(access);

    try {
        let response = await connection
            .execute(
                'insert into `schma` (name, json) values (?, ?)',
                [body.name, body.schema]
            )

        return {
            id: response[0].insertId,
            ...body,
        }

    } catch (error) {
        setResponseStatus(event, 500)
        return {
            error: 'Internal server error'
        }
    }
})