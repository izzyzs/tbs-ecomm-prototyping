export type Brand<T> = { __brand: T };
export type Branded<K, B> = K & Brand<B>;
