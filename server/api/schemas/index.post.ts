import { BaseSchema, BaseSchemaAsync, Output, SafeParseResult, ValiError, any, custom, maxLength, minLength, nonOptional, object, optional, parse, record, safeParse, string, toTrimmed } from "valibot";
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
    json: record(string(), any(), 'JSON schema must be a valid object'),
}, 'object body is required')

type Schema = Output<typeof schema>;

const flatten = <TSchema extends BaseSchema | BaseSchemaAsync>(error: SafeParseResult<TSchema>) : Record<string, any> => {
    return error.issues?.map(issue => {
        let returnable: Record<string, any> = {}
        let path: string[] = issue.path?.map(
            (item) => typeof item.key === 'string' ? item.key : ''
        ) || []
        returnable.path = ["$"].concat(path).join(".")
        returnable.error = issue.message
        return returnable
    }) ?? []
}

export default defineEventHandler(async (event) => {
    const body = await readBody<Schema>(event);

    const parsed = safeParse<typeof schema>(schema, { ...body });

    if (!parsed.success) {
        setResponseStatus(event, 400)
        return flatten(parsed)
    }

    try {
        let res = await db.execute({
            sql: "INSERT INTO schemas (name, description, json) VALUES (?, ?, ?)",
            args: [parsed.output.name, parsed.output.description ?? null, JSON.stringify(parsed.output.json)]
        })

        setResponseStatus(event, 201)
        return {
            id: res.lastInsertRowid?.toString(),
            ...parsed.output
        }
    } catch (error) {
        console.error({ error })
        setResponseStatus(event, 500)
        return {
            error: 'Internal server error'
        }
    }
})