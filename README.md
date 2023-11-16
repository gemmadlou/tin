# Tin [Prototype]

> In progress.

Data transformation and conversion as a service.

![](./app.png)

## Built on Nuxt

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
bun install
```

Run database:

```bash
docker run \
    --detach \
    --name tindb \
    --env MARIADB_USER=tin \
    --env MARIADB_PASSWORD=tin \
    --env MARIADB_ROOT_PASSWORD=tin \
    -p 30066:3306 \
    mariadb:latest
```

Dump db:

```bash
export MYSQL_PWD=tin

mysqldump -h 0.0.0.0 \
    --port 30066 \
    --compact \
    --column-statistics=0 \
    --no-data \
    --databases \
    tin > database/migrate.sql
```

Migrate db:

```bash
export MYSQL_PWD=tin
mysql -h 0.0.0.0 --port 30066  < database/migrate.sql
```

## Example Usage

Example csv file structure:

| Name             | Age | Address                                    |
| ---------------- | --- | ------------------------------------------ |
| John       Smith | 22  | 44 Lincoln Street, A11 1AA, United Kingdom |
| Jane      Blogs  | 30  | 20 Paris Lane, A11 1AA, France             |
| Jack      Black  | 50  | Hollywood Rowe, 1AA A11, United States     |

Create a new JSON schema of the file structure.

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
        }
    },
    "required": [
        "address",
        "age",
        "name"
    ]
}
```

Define a name for the schema. Paste the JSON schema into *Create Schema* box.

Now, we'll upload a file with a slightly different file structure.

| First name | Last name | Age | Country        | Address                    |
| ---------- | --------- | --- | -------------- | -------------------------- |
| John       | Smith     | 22  | United Kingdom | 44 Lincoln Street, A11 1AA |
| Jane       | Blogs     | 30  | France         | 20 Paris Lane, A11 1AA     |
| Jack       | Black     | 50  | United States  | Hollywood Rowe, 1AA A11    |

First, create the file.

```bash
echo 'First name,Last name,Age,Country,Address,,
John,Smith,22,United Kingdom,"44 Lincoln Street, A11 1AA",,
Jane,Blogs,30,France,"20 Paris Lane, A11 1AA",,
Jack,Black,50,United States,"Hollywood Rowe, 1AA A11",,' > ~/tin.csv
```

Upload it via the upload wizard and you'll be able to view the upload in the *Uploads list*.

Extract the data and then view the extracted data.

## Todos

Just an informal list of capabilities todo.

- [ ] Handle multiple headers

...

## Development Server

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
