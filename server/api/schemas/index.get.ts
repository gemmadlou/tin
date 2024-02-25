import { Output, array, custom, integer, literal, minLength, number, object, optional, record, string, toTrimmed, union } from "valibot";
import { db, transformData } from "~/src/sqlite";

const schema = object({
    id: number(),
    name: string(),
    description: string(),
    json: string()
})

type Schema = Output<typeof schema>;

const returnable = object({
    id: number(),
    name: string(),
    description: string(),
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

type Returnable = Output<typeof returnable>;

export default defineEventHandler(async (event) => {
    let sql = 'select * from `schemas` where deleted_at is null';
    let res = await db().execute({ sql, args: [] })

    let data = transformData<Schema>(res)

    return data.map((row) : Returnable => {
        return {
            ...row,
            json: JSON.parse(row.json)
        }
    })
})