import mysql, { ConnectionOptions } from 'mysql2/promise';

const access: ConnectionOptions = {
    user: 'root',
    database: 'tin',
    host: '0.0.0.0',
    port: 30066,
    password: 'tin'
};

export const connection = async () : Promise<mysql.Connection> => {
    let connection = await mysql.createConnection(access);
    return connection
}