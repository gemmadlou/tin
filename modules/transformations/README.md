# Transformations

Taking a schema config and matching it to an upload.

## Inputs

### Schema Config

The schema config works to help generate the mapper config and provide instructions on the structure of the mapped data, and how to interpret the mapped data.

```json
{
    "$schema": "http://json-schema.org/draft-06/schema#",
    "type": "object",
    "additionalProperties": false,
    "properties": {
        "name": {
            "type": "string"
        },
        "age": {
            "type": "integer"
        },
        "address": {
            "type": "string"
        },
        "signed_up": {
            "type": "string",
            "format": "date"
        }
    },
    "required": [
        "address",
        "age",
        "name"
    ]
}
```


### Mapper configuration

By changing the mapper configuration to duplicate some of the schema configuration, the benefit is that
the schema can change without affecting how data is mapped. But duplication is duplication. Versioning
of a schema could ultimately solve this issue. Not sure. Duplication is mostly problematic within the same module.
So...I'll avoid and keep schema configurations separate from mapper configurations for now.

The UI has to somehow convert user data and headings into this mapped format.

```json
{
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
```

### Extracted data

The extracted data comes from the upload.

```json
{
  "First name": "John",
  "Last name": "Smith",
  "Age": "22",
  "Country": "United Kingdom",
  "Address": "44 Lincoln Street, A11 1AA",
  "Joined": "11 December 2023"
}
```

## Todos

Designing how things should work for all scenarios up front is probably best; to think through each problem logically. 
However, to do things differently, I'll work through one problem at a time and slowly build out the mapper configuration
until we have something that's extendable and modular allowing for additional features in the future.

- [ ] Map headings to extracted data
- [ ] Format data defined in schema config
- [ ] Trim data fields
- [ ] Add ability to concat multiple uploaded fields assigned to schema heading using default and custom configuration
- [ ] Split text in uploaded fields to multiple schema headings
- [ ] Convert strings into numbers
- [ ] Set a static value against a schema heading
- [ ] Group multiple lines into one data item