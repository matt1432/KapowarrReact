import type { CamelCasedProperties } from 'type-fest';

export interface RawTask {
    stop: boolean;
    message: string;
    action: string;
    display_title: string;
    category: string;
    volume_id: number | null;
    issue_id: number | null;
}

export type Task = CamelCasedProperties<RawTask>;
