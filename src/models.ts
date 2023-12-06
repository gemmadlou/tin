export type json = string;

type WithNull<T> = {
    [P in keyof T]: T[P] | null;
}

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

export type UploadLinkForm = WithNull<UploadLink>