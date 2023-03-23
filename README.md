# tin

## Roadmap

| When   | Item         | Started            | Dev* | Spec | Doc |
| ------ | ------------ | ------------------ | ---- | ---- | --- |
| 2023H1 | Schemas      | :white_check_mark: |
| 2023H1 | Imports      |
| 2023H1 | Mapper       |
| 2023H1 | Extracts     |
| 2023H1 | Data Sets    |
| 2023H1 | SFTP Uploads |

## Design

```http
POST /schemas
GET  /schemas/:id
POST /schemas/:id
GET  /schemas
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

## Barrelsby

This project uses [barrelsby](https://www.npmjs.com/package/barrelsby) to generate index files to import the controllers.

Edit `.barreslby.json` to customize it:

```json
{
  "directory": [
    "./src/controllers/rest",
    "./src/controllers/pages"
  ],
  "exclude": [
    "__mock__",
    "__mocks__",
    ".spec.ts"
  ],
  "delete": true
}
```
