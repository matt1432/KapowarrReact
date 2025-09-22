import { camelCase, isArray, transform, isObject } from 'lodash';

import type { CamelCasedPropertiesDeep } from 'type-fest';
import type { ExtendableRecord } from 'typings/Misc';

export default function camelize<
    T extends ExtendableRecord = ExtendableRecord,
    K extends CamelCasedPropertiesDeep<T> = CamelCasedPropertiesDeep<T>,
>(obj: T) {
    return transform(obj, (result: ExtendableRecord, value: unknown, key: string, target) => {
        const camelKey = isArray(target) ? key : camelCase(key);
        result[camelKey] = isObject(value) ? camelize(value) : value;
    }) as K;
}
