import { BaseSchema, BaseSchemaAsync, Output, SafeParseResult, ValiError, any, array, custom, intersect, literal, maxLength, minLength, nonOptional, object, optional, parse, record, safeParse, string, toTrimmed, union } from "valibot";
import { db } from "~/src/sqlite";

const flatten = <TSchema extends BaseSchema | BaseSchemaAsync>(error: SafeParseResult<TSchema>): Record<string, any> => {
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

const schema = object({
    json: object({
        $schema: string("Schema id is required"),
        title: string("Title is required", [toTrimmed(), minLength(1)]),
        description: string(
            "Description must be a string",
            [
                toTrimmed(),
                custom(
                    (input) => input.length > 3 && input.length <= 200,
                    "Description length must be between 3 and 200 characters"
                )
            ]
        ),
        type: literal("object"),
        properties: record(string(), object({
            type: string("JSON schema property type is required"),
            format: optional(string("Valid JSON schema format type is required"))
        })),
        required: array(string())
    }, 'JSON schema must be a valid object'),
}, 'object body is required')

type Schema = Output<typeof schema>;

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
            args: [parsed.output.json.title, parsed.output.json?.description ?? null, JSON.stringify(parsed.output.json)]
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