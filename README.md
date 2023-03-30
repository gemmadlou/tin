# Tin

Tin is a fun project for me and is **under development**. 
It will hopefully be an API service to upload and manage all sorts of differently 
structured data files which can then be mapped, transformed and conformed
consistently to defined schemas.

## Roadmap MVP

| When   | Item              | Started            | Dev*               | Doc |
| ------ | ----------------- | ------------------ | ------------------ | --- |
| 2023H1 | Schemas           | :white_check_mark: | :white_check_mark: |
| 2023H1 | Imports           | :white_check_mark: |
|        | /> CSV            | :white_check_mark: | :white_check_mark: |
|        | /> XLSX           |
|        | /> Background job |
| 2023H1 | Mapper            | :white_check_mark: |
| 2023H1 | Transform         |
| 2023H1 | Data Sets         |
| 2023H1 | SFTP Uploads      |

## Scratch pad

> Just design notes, ideas and pseudocode

Design -> https://bjdash.github.io/JSON-Schema-Builder/
Validator -> https://www.jsonschemavalidator.net/

```
# Mapper
# schema field dot.notation if nested - no arrays
# Example schema
{
  id: {
    fields: ['OfficeId']
  },
  name: {
    fields: ['OfficeName']
  },
  parentId: {
    fields: ['ParentOfficeId']
  }
}
```

## Tutorials

## End-to-End - creating a schema based filed importer

...in progress

Step. Creating a schema

```http
echo '{
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
}' | jq -c | http post http://0.0.0.0:8083/api/schemas
```

Step. Creating an import

```http
http -f post http://0.0.0.0:8083/api/imports \
  schemaId=1 \
  importMapId=1 \
  file@fixtures/offices.csv 
```

Step. Creating a mapper for an import

```http
echo '{
  "schemaId": 1,
  "imports": [],
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
