# Tin: a self-service data transformation API for structured upload documents

Tin is a fun project for me and is **under development** built with TsEd and Typescript.
It will hopefully be an API service to upload and manage all sorts of differently 
structured data files which can then be mapped, transformed and conformed
consistently to defined schemas.

> Make it work. Make it right. Make it fast.
> It's currently under the "**Make it work**" phase :smile:

## Roadmap MVP

Take a scheme, and map documents to conform to the schema.

| When   | Item              | Started            | Dev*               | Doc |
| ------ | ----------------- | ------------------ | ------------------ | --- |
| 2023H1 | Schemas           | :white_check_mark: | :white_check_mark: |
| 2023H1 | Imports           | :white_check_mark: |
|        | /> CSV            | :white_check_mark: | :white_check_mark: |
|        | /> XLSX           |
|        | /> Background job |
| 2023H1 | Mapper            | :white_check_mark: |
| 2023H1 | Transform         | :white_check_mark: |
| 2023H1 | Data Sets         |
| 2023H1 | SFTP Uploads      |

## Scratchpad

> Just design notes, ideas and pseudocode

Design -> https://bjdash.github.io/JSON-Schema-Builder/
Validator -> https://www.jsonschemavalidator.net/


## Tutorials

## End-to-End - creating a schema based filed importer

> ...in progress...

We'll be using an example of creating a data transformation to conform a data upload to our **Office** schema:

| id            | name     | parent        |
| ------------- | -------- | ------------- |
| `int\|string` | `string` | `int\|string` |

### Step 1. Creating a schema

A schema includes a JSON spec to define the properties in the schema structure.

```json
{
    "name": "office",
    "schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "office",
        "type": "object",
        "title": "Office",
        "properties": {
            "id": {
                "description": "Office id",
                "oneOf": [
                    {
                        "type": "string"
                    },
                    {
                        "type": "integer"
                    }
                ]
            },
            "name": {
                "type": "string",
                "description": "Office name"
            },
            "parent": {
                "description": "Office parent - either id or name",
                "oneOf": [
                    {
                        "type": "string"
                    },
                    {
                        "type": "integer"
                    }
                ]
            }
        },
        "required": [
            "id",
            "name"
        ]
    }
}
```

Add the schema to the service:

```bash
cat fixtures/tutorial/post.schema.json \
  | jq -c \
  | http post http://0.0.0.0:8083/api/schemas
```

View created schema:

```bash
http http://0.0.0.0:8083/api/schemas
```

### Step 2. Creating an import

The following data document will be imported into the API as a CSV.

| OfficeId | Name             | ParentOfficeId |
| -------- | ---------------- | -------------- |
| 1        | Glasgow          |
| 2        | London,          |
| 3        | Kensington       | 2              |
| 4        | Southwark        | 2              |
| 5        | Kensington North | 3              |
| 6        | Kensington South | 3              |

Import the file.

```bash
http -f post http://0.0.0.0:8083/api/imports \
  schemaId=1 \
  file@fixtures/offices.csv 
```

View the import file information.

```json
{
  "created": "2023-04-07T05:29:05.218Z",
  "filename": "56cbe7dd4ef949450a65dd644fcfe60b",
  "filepath": "uploads/56cbe7dd4ef949450a65dd644fcfe60b",
  "id": 1,
  "importMapId": null,
  "mimetype": "text/csv",
  "originalName": "offices.csv",
  "schemaId": 1,
  "size": 120,
  "updated": "2023-04-07T05:29:05.218Z"
}
```

View the import data:

```bash
http http://0.0.0.0:8083/api/imports/1/data
```

The output should return an array:

```json
[
    {
        "created": "2023-04-07T05:29:05.218Z",
        "id": 1,
        "importId": 1,
        "row": {
            "Name": "Glasgow",
            "OfficeId": "1",
            "ParentOfficeId": ""
        },
        "updated": "2023-04-07T05:29:05.218Z"
    },
    ...
]
```

### Step 3. Creating a mapper for an import

To map the data upload to the pre-defined schema, a mapper is needed to determine which fields should be connected.

| Data Field     | ->  | Schema Field |
| -------------- | --- | ------------ |
| OfficeId       | ->  | id           |
| Name           | ->  | name         |
| ParentOfficeId | ->  | parent       |

The config object takes the schema field, and defines the data fields it relates to:

```json
{
  id: {
    fields: ['OfficeId']
  }
}
```

Create a new mapper for the import:

```bash
echo '{
  "schemaId": 1,
  "imports": [1],
  "config": {
    "id": {
      "fields": [
          "OfficeId"
      ]
    },
    "name": {
      "fields": [
        "OfficeName"
      ]
    },
    "parent": {
      "fields": [
        "ParentOfficeId"
      ]
    }
  }
}' | jq | http post http://0.0.0.0:8083/api/mappers
```

### Step 4. Transforming an import through the mapper.

```bash
http post http://0.0.0.0:8083/api/imports/1/transform mapperId=1
```

## Reusing data maps for new uploads

...to be written

### Handling multiple fields to a single schema property

...in progress

---

## Guides

...in progress

## Schema

...in progress

## Mapper

...in progress

## Datasets

...in progress


## Getting started

> **Important!** Ts.ED requires Node >= 14, Express >= 4 and TypeScript >= 4.

```batch
# install dependencies
$  install

# serve
$  start

# build for production
$  build
$  start:prod
```

## Docker

```
# build docker image
docker compose build

# start docker image
docker compose up
```
