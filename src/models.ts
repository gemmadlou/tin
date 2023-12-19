export type json = string;

type WithNull<T> = {
    [P in keyof T]: T[P] | null;
}

type WithUndefined<T> = {
    [P in keyof T]: T[P] | undefined;
}

export type Schema = {
    id: number,
    name: string,
    json: json
}

export type UndefinedSchema = WithUndefined<Schema>

export type UploadLink = {
    id: number,
    schema_id: number,
    upload_id: number,
    mapper_id: number,
    uuid: string,
    name: string
}

export type UndefinedUploadLink = WithUndefined<UploadLink>

export type UploadLinkForm = WithNull<UploadLink>

export type Upload = {
    created: String,
    id: Number,
    filename: String,
    filepath: String
}