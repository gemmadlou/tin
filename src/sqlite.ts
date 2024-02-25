import { createClient, type ResultSet } from "@libsql/client";

const config = {
    url: "file:local.db"
};

let _db;

export const db = () => {
    _db = createClient(config);

    return _db
}

export const transformData = <T extends Record<string, unknown>>(input: ResultSet): T[] => {
    const columns = input.columns;
    const rows = input.rows;

    return rows.map(row => {
        const obj = {} as T; // Specify type for obj
        columns.forEach((column, index) => {
            // Use type assertion for obj[column] to satisfy the TypeScript compiler
            obj[column as keyof T] = row[index] as T[keyof T];
        });
        return obj;
    });
}