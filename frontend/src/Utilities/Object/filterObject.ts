/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ExtendableRecord } from 'typings/Misc';

export default function filterObject<K extends string, T extends ExtendableRecord<K>>(
    obj: T,
    callback: (entry: [K, any]) => boolean,
) {
    return Object.fromEntries((Object.entries(obj) as [K, any][]).filter(callback));
}
