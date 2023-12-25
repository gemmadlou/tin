// @vitest-environment nuxt
import { expect, test, describe } from 'vitest'
import { type Data, mapDataValuesToSchemaHeadings, type Mapper, type Mapped } from './Transformer'

describe("Feature: Map schema headings to multiple extracted data fields", () => {
    test('Example Case: Similarly structured User Profile', () => {
        let expected: Mapped[] = [
            { schemaHeading: "name", dataValues: ["John", "Smith"] },
            { schemaHeading: "age", dataValues: [22] },
            { schemaHeading: "address", dataValues: ["44 Lincoln Street, A11 1AA", "United Kingdom"] },
            { schemaHeading: "signed_up", dataValues: ["11 December 2023"] }
        ]

        let dataInput = new Set<Data>([
            {
                heading: "First name",
                value: "John"
            },
            {
                heading: "Last name",
                value: "Smith"
            },
            {
                heading: "Age",
                value: 22
            },
            {
                heading: "Country",
                value: "United Kingdom"
            },
            {
                heading: "Address",
                value: "44 Lincoln Street, A11 1AA"
            },
            {
                heading: "Joined",
                value: "11 December 2023"
            }
        ])

        let mapper = new Set<Mapper>([
            {
                schemaHeading: "name",
                dataHeadings: ["First name", "Last name"]
            },
            {
                schemaHeading: "age",
                dataHeadings: [{
                    headingName: "Age"
                }]
            },
            {
                schemaHeading: "address",
                dataHeadings: ["Address", "Country"]
            },
            {
                schemaHeading: "signed_up",
                dataHeadings: ["Joined"]
            }
        ])

        let actual = mapDataValuesToSchemaHeadings(mapper, dataInput)

        expect(actual).toEqual(expected)
    })

    test('Edge Case: Don\'t map schema headings when data value does not exist', () => {
        let expected: Mapped[] = [
            { schemaHeading: "name", dataValues: ["John", "Smith"] },
            { schemaHeading: "age", dataValues: [] }
        ]

        let dataInput = new Set<Data>([
            {
                heading: "First name",
                value: "John"
            },
            {
                heading: "Last name",
                value: "Smith"
            }
        ])

        let mapper = new Set<Mapper>([
            {
                schemaHeading: "name",
                dataHeadings: ["First name", "Last name"]
            },
            {
                schemaHeading: "age",
                dataHeadings: ["Age"]
            }
        ])

        let actual = mapDataValuesToSchemaHeadings(mapper, dataInput)

        expect(actual).toEqual(expected)

    })
})

describe("Feature: Map data fields across multiple schema headings", () => {
    test("Example case: Splitting a single line data Address", () => {
        let expected: Mapped[] = [
            { schemaHeading: "address_line_1", dataValues: ["Stark Tower"] },
            { schemaHeading: "address_line_2", dataValues: ["Manhattan"] }
        ]

        let dataInput: Set<Data> = new Set([
            {
                heading: "address",
                value: "Stark Tower, Manhattan"
            }
        ])

        let mapper: Set<Mapper> = new Set([
            {
                schemaHeading: "address_line_1",
                dataHeadings: [
                    {
                        headingName: "address",
                        delimitation: {
                            delimiter: ",",
                            delimitedIndex: 0
                        }
                    }
                ]
            }, {
                schemaHeading: "address_line_2",
                dataHeadings: [
                    {
                        headingName: "address",
                        delimitation: {
                            delimiter: ",",
                            delimitedIndex: 1
                        }
                    }
                ]
            }
        ])

        let actual = mapDataValuesToSchemaHeadings(mapper, dataInput)

        expect(actual).toEqual(expected)
    })

    test("Example case: Mixing field splitting with whole fields", () => {
        let expected: Mapped[] = [
            { schemaHeading: "address_line_1", dataValues: ["Stark Tower", "ABC"] },
            { schemaHeading: "address_line_2", dataValues: ["Manhattan"] }
        ]

        let dataInput: Set<Data> = new Set([
            {
                heading: "address",
                value: "Stark Tower, Manhattan"
            },
            {
                heading: "zipCode",
                value: "ABC"
            }
        ])

        let mapper: Set<Mapper> = new Set([
            {
                schemaHeading: "address_line_1",
                dataHeadings: [
                    {
                        headingName: "address",
                        delimitation: {
                            delimiter: ",",
                            delimitedIndex: 0
                        }
                    },
                    "zipCode"
                ]
            }, {
                schemaHeading: "address_line_2",
                dataHeadings: [
                    {
                        headingName: "address",
                        delimitation: {
                            delimiter: ",",
                            delimitedIndex: 1
                        }
                    }
                ]
            }
        ])

        let actual = mapDataValuesToSchemaHeadings(mapper, dataInput)

        expect(actual).toEqual(expected)
    })
})

describe("Feature: Set a static value schema heading", () => {
    test("Example case: Setting the source field to Google.com", () => {
        let expected: Mapped[] = [
            { schemaHeading: "Title", dataValues: ["John Doe went to mars"] },
            { schemaHeading: "Source", dataValues: ["google.com"] }
        ]

        let dataInput: Set<Data> = new Set([
            {
                heading: "article",
                value: "John Doe went to mars"
            }
        ])

        let mapper: Set<Mapper> = new Set([
            {
                schemaHeading: "Title",
                dataHeadings: ["article"]
            },
            {
                schemaHeading: "Source",
                dataHeadings: [
                    {
                        static: "google.com"
                    }
                ]
            }
        ])

        let actual = mapDataValuesToSchemaHeadings(mapper, dataInput)

        expect(actual).toEqual(expected)
    })
})

describe("Feature: format dates", () => {
    test("Example case: a series of dates", () => {
        let expected: Mapped[] = [
            { schemaHeading: "Joined", dataValues: ["2025-12-11"] },
        ]

        let dataInput: Set<Data> = new Set([
            { heading: "signed_up", value: "11 December 2025" }
        ])

        let mapper: Set<Mapper> = new Set([
            {
                schemaHeading: "Joined",
                dataHeadings: [
                    {
                        headingName: "signed_up",
                        format: 'date'
                    }
                ]
            }
        ])

        let actual = mapDataValuesToSchemaHeadings(mapper, dataInput)

        expect(actual).toEqual(expected)
    })
})