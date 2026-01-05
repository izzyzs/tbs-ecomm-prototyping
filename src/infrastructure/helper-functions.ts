export class SupabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SupabaseError";
    }
}

export class LocalStorageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LocalStorageError";
    }
}

export function requiredField<T, E extends Error>(
    value: T,
    ErrorType: new (message: string) => E,
    label: string
): NonNullable<T> {
    if (value == null) throw new ErrorType(`${label} is null`);
    return value as NonNullable<T>;
}