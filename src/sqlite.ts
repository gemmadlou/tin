import { createClient } from "@libsql/client";

const config = {
    url: "file:local.db"
};

let _db;

export const db = () => {
    _db = createClient(config);

    return _db
}