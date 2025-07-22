/* eslint-disable @typescript-eslint/no-explicit-any */

import { camelCase, isArray, transform, isObject } from 'lodash';
import type { CamelCasedPropertiesDeep } from 'type-fest';

export default function camelize<
    T extends Record<string, any> = Record<string, any>,
    K extends CamelCasedPropertiesDeep<T> = CamelCasedPropertiesDeep<T>,
>(obj: T) {
    return transform(obj, (result: Record<string, any>, value: any, key: string, target) => {
        const camelKey = isArray(target) ? key : camelCase(key);
        result[camelKey] = isObject(value) ? camelize(value as Record<string, unknown>) : value;
    }) as K;
}
