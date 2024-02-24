import type { BaseSchema, BaseSchemaAsync, SafeParseResult } from "valibot"

/**
 * Flattens Valibot errors
 */
export const flatten = <TSchema extends BaseSchema | BaseSchemaAsync>(error: SafeParseResult<TSchema>): Record<string, any> => {
    return error.issues?.map(issue => {
        let returnable: Record<string, any> = {}
        let path: string[] = issue.path?.map(
            (item) => typeof item.key === 'string' ? item.key : ''
        ) || []
        returnable.path = ["$"].concat(path).join(".")
        returnable.error = issue.message
        return returnable
    }) ?? []
}