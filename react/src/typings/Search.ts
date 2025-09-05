import type { CamelCasedProperties } from 'type-fest';

import type { MatchRejection } from 'Helpers/Props/matchRejections';

export interface RawSearchResult {
    series: string;
    year: number | null;
    volume_number: number | [number, number] | null;
    special_version: string | null;
    issue_number: number | null;
    _issue_number: number | [number, number];
    annual: boolean;

    match: boolean;
    match_rejections: MatchRejection[];
    rank: number[];

    link: string;
    display_title: string;
    source: string;
    filesize: number;
    pages: number;

    // Libgen stuff
    releaser: string | null;
    scan_type: string | null;
    resolution: string | null;
    dpi: string | null;
    extension: string | null;
    comics_id: number | null;
    md5: string | null;
}

export type SearchResult = CamelCasedProperties<RawSearchResult>;

export type InteractiveSearchSort =
    | 'match'
    | 'issueNumber'
    | 'displayTitle'
    | 'filesize'
    | 'pages'
    | 'releaser'
    | 'scanType'
    | 'resolution'
    | 'dpi'
    | 'source'
    | 'matchRejections';

interface IssueSearchPayload {
    issueId: number;
}

interface VolumeSearchPayload {
    volumeId: number;
}

export type InteractiveSearchPayload = IssueSearchPayload | VolumeSearchPayload;
