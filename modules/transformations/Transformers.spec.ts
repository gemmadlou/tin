// @vitest-environment nuxt
import { expect, test, describe } from 'vitest'
import { type Data, mapDataHeadingsToSchemaHeadings, type Mapper } from './Transformer'

describe("Feature: Map schema headings to multiple extracted data fields", () => {
    test('Expected Case:', () => {
        let expected = {
            name: [ "John", "Smith" ],
            age: [22],
            address: ["44 Lincoln Street, A11 1AA", "United Kingdom"],
            signed_up: ["11 December 2023"]
        }
        
        let dataInput = new Set<Data>([
            {
                dataHeading: "First name",
                dataValue: "John"
            },
            {
                dataHeading: "Last name",
                dataValue: "Smith"
            },
            {
                dataHeading: "Age",
                dataValue: 22
            },
            {
                dataHeading: "Country",
                dataValue: "United Kingdom"
            },
            {
                dataHeading: "Address",
                dataValue: "44 Lincoln Street, A11 1AA"
            },
            {
                dataHeading: "Joined",
                dataValue: "11 December 2023"
            }
        ])
    
        let mapper = new Set<Mapper>([
            {
                schemaHeading: "name",
                dataHeadings: [ "First name", "Last name" ]
            },
            {
                schemaHeading: "age",
                dataHeadings: [ "Age" ]
            },
            {
                schemaHeading: "address",
                dataHeadings: [ "Address", "Country" ]
            },
            {
                schemaHeading: "signed_up",
                dataHeadings: [ "Joined" ]
            }
        ])
    
        let actual = mapDataHeadingsToSchemaHeadings(mapper, dataInput)
    
        expect(actual).toEqual(expected)
    })
    
    test('Edge Case: Don\'t map schema headings when data value does not exist', () => {
        let expected = {
            name: [ "John", "Smith" ]
        }
    
        let dataInput = new Set<Data>([
            {
                dataHeading: "First name",
                dataValue: "John"
            },
            {
                dataHeading: "Last name",
                dataValue: "Smith"
            }
        ])
    
        let mapper = new Set<Mapper>([
            {
                schemaHeading: "name",
                dataHeadings: [ "First name", "Last name" ]
            },
            {
                schemaHeading: "age",
                dataHeadings: [ "Age" ]
            }
        ])
    
        let actual = mapDataHeadingsToSchemaHeadings(mapper, dataInput)
    
        expect(actual).toEqual(expected)
        
    })
})