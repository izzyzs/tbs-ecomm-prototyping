export function requiredField<T, E extends Error>(
    value: T,
    ErrorType: new (message: string) => E,
    label: string
): NonNullable<T> {
    if (value == null) throw new ErrorType(`requiredField: ${label} is null`);
    return value as NonNullable<T>;
}