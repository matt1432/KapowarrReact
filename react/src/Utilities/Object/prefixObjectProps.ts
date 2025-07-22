import type { PascalCase } from 'type-fest';

type PrefixObjectProps<T, P extends string> = {
    [K in keyof T as K extends string ? `${P}${PascalCase<K>}` : never]: T[K];
};

export default function prefixObjectProps<T extends object, K extends string>(obj: T, prefix: K) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => [
            prefix + key[0].toUpperCase() + key.slice(1, -1),
            val,
        ]),
    ) as PrefixObjectProps<T, K>;
}
