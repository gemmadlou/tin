export type json = string;

export type Schema = {
    id: number,
    name: string,
    json: json
}

export type UploadLink = {
    id: number,
    schema_id: number,
    uuid: string,
    name: string
}