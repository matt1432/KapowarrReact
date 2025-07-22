/* eslint-disable @typescript-eslint/no-explicit-any */

import { snakeCase, isArray, transform, isObject } from 'lodash';
import type { SnakeCasedPropertiesDeep } from 'type-fest';

export default function snakeify<
    T extends Record<string, any> = Record<string, any>,
    K extends SnakeCasedPropertiesDeep<T> = SnakeCasedPropertiesDeep<T>,
>(obj: T) {
    return transform(obj, (result: Record<string, any>, value: any, key: string, target) => {
        const snakeKey = isArray(target) ? key : snakeCase(key);
        result[snakeKey] = isObject(value) ? snakeify(value as Record<string, unknown>) : value;
    }) as K;
}
