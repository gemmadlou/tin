import mysql, { ConnectionOptions } from 'mysql2/promise';

// @todo drive through Dotenv
const access: ConnectionOptions = {
    user: 'root',
    database: 'tin',
    host: '0.0.0.0',
    port: 30066,
    password: 'tin'
};

let connected : mysql.Connection | undefined = undefined;

export const connection = async () : Promise<mysql.Connection> => {
    if (connected) {
        return connected;
    }

    connected = await mysql.createConnection(access);

    return connected
}