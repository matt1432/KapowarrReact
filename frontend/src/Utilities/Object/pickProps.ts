import filterObject from './filterObject';
import type { ExtendableRecord } from 'typings/Misc';

export default function pickProps<
    K extends string,
    T extends ExtendableRecord<K>,
>(obj: T, ...keys: K[]) {
    return filterObject(obj, ([key]) => keys.includes(key as K)) as Pick<T, K>;
}
