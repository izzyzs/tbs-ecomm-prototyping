export function buildPatch<T extends Record<string, unknown>>(initial: T, current: T): Partial<T> {
    const patch: Partial<T> = {}
    for (const key of Object.keys(current) as (keyof T)[]) {
        if (current[key] !== initial[key]) patch[key] = current[key]
    }
    return patch
}

export function getString(fd: FormData, k: string): string | null {
    const v = fd.get(k)
    if (v === null) return null
    if (typeof v !== "string") throw new Error(`Invalid ${k}`)
    return v
}
export function getNumber(fd: FormData, k: string): number | null {
    const s = getString(fd, k)
    if (s === null || s.trim() === "") return null
    const n = Number(s)
    if (!Number.isFinite(n)) throw new Error(`Invalid ${k}`)
    return n
}
export function getBool(fd: FormData, k: string): boolean {
    return fd.get(k) !== null
}

