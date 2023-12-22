// @vitest-environment nuxt
import { expect, test } from 'vitest'
import { mapDataHeadingsToSchemaHeadings } from './Transformer'

test('Feature: Map schema headings to multiple extracted data fields', () => {
    let extractedData = {
        "First name": "John",
        "Last name": "Smith",
        "Age": 22,
        "Country": "United Kingdom",
        "Address": "44 Lincoln Street, A11 1AA",
        "Joined": "11 December 2023"
    }

    let mapperConfig = {
        "name": [
            "First name",
            "Last name"
        ],
        "age": [
            "Age"
        ],
        "address": [
            "Address",
            "Country"
        ],
        "signed_up": [
            "Joined"
        ]
    }

    let actual = mapDataHeadingsToSchemaHeadings(mapperConfig, extractedData)
    let expected = {
        name: [ "John", "Smith" ],
        age: [22],
        address: ["44 Lincoln Street, A11 1AA", "United Kingdom"],
        signed_up: ["11 December 2023"]
    }

    expect(actual).toEqual(expected)
})
