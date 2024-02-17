import { Output, any, custom, flatten, maxLength, minLength, nonOptional, object, optional, parse, record, safeParse, string, toTrimmed } from "valibot";
import { db } from "~/src/sqlite";

const schema = object({
    name: string('A schema name is required', [toTrimmed(), minLength(3, 'Must have minimum length of 3')]),
    description: optional(
        string(
            "Description must be a string",
            [
                toTrimmed(),
                custom(
                    (input) => input.length > 3 && input.length <= 200,
                    "Description length must be between 3 and 200 characters"
                )
            ]
        )
    ),
    json: record(string(), any([toTrimmed()]), 'JSON schema must be a valid object'),
}, 'object body is required')

type Schema = Output<typeof schema>;

export default defineEventHandler(async (event) => {
    const body = await readBody<Schema>(event);

    const parsed = safeParse(schema, { ...body });

    if (!parsed.success) {
        return parsed.issues.map(issue => {
            let returnable: Record<string, any> = {}
            let path: string[] = issue.path?.map<string>((item) => item.key) || []
            returnable.path = ["$"].concat(path).join(".")
            returnable.error = issue.message
            return returnable
        })
    }

    let { rows } = await db.execute("SELECT 1");
    return rows
    // let validated = CreateSchemaRequest.safeParse(body)

    // if (!validated.success) {
    //     setResponseStatus(event, 400)
    //     return validated.error.flatten();
    // }

    // try {
    //     let conn = await connection()
    //     let response = await conn.execute(
    //         'insert into `schemas` (name, json) values (?, ?)',
    //         [validated.data.name, validated.data.json]
    //     )

    //     return {
    //         id: response[0].insertId,
    //         ...body,
    //     }

    // } catch (error) {
    //     console.error({ error })
    //     setResponseStatus(event, 500)
    //     return {
    //         error: 'Internal server error'
    //     }
    // }
})