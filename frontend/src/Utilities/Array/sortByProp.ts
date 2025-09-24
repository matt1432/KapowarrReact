import type { KeyAsString } from 'type-fest';

export function sortByProp<
    T extends Record<K, string>,
    K extends KeyAsString<T>,
>(sortKey: K) {
    return (a: T, b: T) => {
        return a[sortKey].localeCompare(b[sortKey], undefined, {
            numeric: true,
        });
    };
}

export default sortByProp;
