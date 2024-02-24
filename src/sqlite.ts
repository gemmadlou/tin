import { createClient, type ResultSet } from "@libsql/client";

const config = {
    url: "file:local.db"
};

let _db;

export const db = () => {
    _db = createClient(config);

    return _db
}

export const transformData = <T>(input: ResultSet): Record<string, T>[] => {
    const columns = input.columns;
    const rows = input.rows;

    return rows.map(row => {
        const obj: Record<string, T> = {}; // Specify type for obj
        columns.forEach((column, index) => {
            obj[column] = row[index] as T; // Cast row[index] to type T
        });
        return obj;
    });
}