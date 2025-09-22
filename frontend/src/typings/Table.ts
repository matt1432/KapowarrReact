import type { Column } from 'Components/Table/Column';

export interface TableOptionsChangePayload<T extends string> {
    pageSize?: number;
    columns?: Column<T>[];
}
