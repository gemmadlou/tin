import { BaseSchema, BaseSchemaAsync, Output, SafeParseResult, ValiError, any, array, custom, intersect, literal, maxLength, minLength, nonOptional, object, optional, parse, record, safeParse, string, toTrimmed, union } from "valibot";
import { db } from "~/src/sqlite";
import { defineEventHandler } from 'h3';
import { flatten } from "~/utils/Flatten";

export const schema = object({
    json: object({
        $schema: string("is required"),
        title: string("is required", [toTrimmed(), minLength(1)]),
        description: string(
            "must be a string",
            [
                toTrimmed(),
                custom(
                    (input) => input.length > 3 && input.length <= 200,
                    "length must be between 3 and 200 characters"
                )
            ]
        ),
        type: literal("object", "Must be 'object'"),
        properties: record(string(), object({
            type: string("JSON schema property type is required"),
            format: optional(string("Valid JSON schema format type is required"))
        }), 'must be a valid array'),
        required: array(string(), 'must be a valid array')
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
        let res = await db().execute({
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