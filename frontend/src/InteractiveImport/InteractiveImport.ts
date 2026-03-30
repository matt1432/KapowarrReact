import type { CamelCasedProperties } from 'type-fest';

export type SelectType =
    | 'issueIds'
    | 'releaser'
    | 'scanType'
    | 'resolution'
    | 'dpi'
    | 'notes';

export interface RawFileMatch {
    id: number;
    file_id: number | null;
    filepath: string;
    general_file: boolean;
    forced_match: boolean;
    issue_ids: number[];
    releaser: string;
    scan_type: string;
    resolution: string;
    dpi: string;
    notes: string;
}

export type FileMatch = CamelCasedProperties<RawFileMatch>;
