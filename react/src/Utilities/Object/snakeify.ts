import { snakeCase, isArray, transform, isObject } from 'lodash';

import type { SnakeCasedPropertiesDeep } from 'type-fest';
import type { ExtendableRecord } from 'typings/Misc';

export default function snakeify<
    T extends ExtendableRecord = ExtendableRecord,
    K extends SnakeCasedPropertiesDeep<T> = SnakeCasedPropertiesDeep<T>,
>(obj: T) {
    return transform(obj, (result: ExtendableRecord, value: unknown, key: string, target) => {
        const snakeKey = isArray(target) ? key : snakeCase(key);
        result[snakeKey] = isObject(value) ? snakeify(value) : value;
    }) as K;
}
