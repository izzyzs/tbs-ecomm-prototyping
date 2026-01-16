export function requiredField(value, ErrorType, label) {
    if (value == null)
        throw new ErrorType(`requiredField: ${label} is null`);
    return value;
}
