export class SupabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "SupabaseError";
    }
}
export class LocalStorageError extends Error {
    constructor(message) {
        super(message);
        this.name = "LocalStorageError";
    }
}
