import { describe, expect, test } from "vitest";


describe('POST /api/schemas', () => {
    describe('validation failure', async () => {
        const res = await fetch("http://localhost:3000/api/schemas", { method: 'POST' })
        const body = await res.json()

        test('status code to be 422', async () => {
            expect(res.status).toStrictEqual(400)
        })

        test('validation message', async () => {
            expect(body).toStrictEqual([
                { path: '$.name', error: 'A schema name is required' },
                { path: '$.json', error: 'JSON schema must be a valid object' }
            ])
        })
    })

    describe('saving a default schema', async () => {
        let data = {
            name: 'Address',
            description: "A UK property address",
            json: {
                "$schema": "http://json-schema.org/draft-06/schema#",
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "tenant_name": {
                        "type": "string"
                    },
                    "address_1": {
                        "type": "string"
                    },
                    "address_2": {
                        "type": "string"
                    },
                    "address_3": {
                        "type": "string"
                    },
                    "postcode": {
                        "type": "string"
                    },
                    "date_built": {
                        "type": "string",
                        "format": "date"
                    }
                },
                "required": [
                    "address_1",
                    "address_2",
                    "postcode"
                ]
            }
        }

        const res = await fetch(
            "http://localhost:3000/api/schemas",
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }
        )

        test('success', async () => {
            const body = await res.json()
            expect(res.status).toEqual(201)
            expect(body.id).not.toBeUndefined()
        })

    })

    describe.skip('saving an uploaded schema file', () => {

    })

    describe.skip('saving a url pointed schema', () => {

    })

})