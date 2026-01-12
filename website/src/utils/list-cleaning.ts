import { capitalize } from "./capitalize";

export function cleanList(arr: [string]) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length < 1) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
    let out: Partial<T> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (typeof v === "string" && v.length > 0) {
            console.log(`santizing ${v}`);
            console.log(capitalize(v));
            (out as any)[k] = capitalize(v);
        }
    }
    return out;
}
