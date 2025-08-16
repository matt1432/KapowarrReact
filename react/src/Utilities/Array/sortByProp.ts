import type { StringKeyOf } from 'type-fest';

export function sortByProp<T extends Record<K, string>, K extends StringKeyOf<T>>(sortKey: K) {
    return (a: T, b: T) => {
        return a[sortKey].localeCompare(b[sortKey], undefined, { numeric: true });
    };
}

export default sortByProp;
