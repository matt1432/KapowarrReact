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

export interface RawTaskHistory {
    task_name: string;
    display_title: string;
    run_at: number;
}

export type TaskHistory = CamelCasedProperties<RawTaskHistory>;

export interface RawTaskPlanning {
    task_name: string;
    display_name: string;
    interval: number;
    next_run: number;
    last_run: number;
}

export type TaskPlanning = CamelCasedProperties<RawTaskPlanning>;
