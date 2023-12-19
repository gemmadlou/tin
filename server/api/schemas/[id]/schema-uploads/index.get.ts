import { connection } from "~/src/mysql"

class QueryBuilder {
    id: string | number;

    query: string[] = [];
    params: Array<string | number> = [];

    constructor(id: string | number) {
        this.id = id;
        this.query.push(`select * from schema_uploads where schema_id = ? and deleted_at is null`)
        this.params.push(id)
    }

    static create(id: string | number) {
        return new QueryBuilder(id)
    }

    filterByStatus(value: string) {
        this.query.push(`and status = ?`)
        this.params.push(value)
        return this
    }

    getQuery() {
        return this.query.join(" ")
    }

    getParams() {
        return this.params
    }
}


export default defineEventHandler(async (event) => {
    let conn = await connection()

    let builder = QueryBuilder.create(event.context?.params?.id)

    let queryParams = getQuery(event)

    if (queryParams.status)
        builder.filterByStatus(queryParams.status);

    let [response] = await conn.query(
        builder.getQuery(),
        builder.getParams()
    )

    return response
})