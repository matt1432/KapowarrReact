// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtendableRecord<Keys extends string = string> = Record<Keys, any>;

export type Nullable<T> = T | null | undefined;
