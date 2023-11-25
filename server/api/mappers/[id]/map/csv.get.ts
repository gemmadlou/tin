import { connection } from "~/src/mysql";

export default defineEventHandler(async (event) => {
    let conn = await connection();

    let [data] = await conn.query(
        'select * from `mapped_data` where mapper_id = ?',
        [event.context?.params?.id]
    )

    let keys : string[] = []
    let mapped = data
        .map(i => JSON.parse(i.json))
        .map((property: Record<string, any>) => {
            if (keys.length === 0) {
                keys = Object.keys(property)
                    .map(i => `"${i}"`)
                    .join(",")
            }

            return Object.keys(property)
                .map(i => property[i].join(" ")) // Join multi-fields together
                .map(i => `"${i}"`)
                .join(",")
        })

    setResponseHeader(event, 'Content-disposition', 'attachment; filename=mapped.csv')
    setResponseHeader(event, 'Content-Type', 'text/csv')

    return [keys].concat(mapped).join("\n");
})