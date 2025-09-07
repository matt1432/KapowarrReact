import type { DownloadState } from 'Helpers/Props/downloadStates';
import type { CamelCasedProperties } from 'type-fest';

// FIXME: this type is incomplete
export interface RawDownloadItem {
    id: number;
    volume_id: number;
    issue_id: number | null;
    web_link: string | null;
    web_title: string | null;
    web_sub_title: string | null;
    download_link: string;
    pure_link: string;
    source_type: string;
    source_name: string;
    type: string;
    file: string;
    title: string;
    download_folder: string;
    size: number;
    status: DownloadState;
    progress: number;
    speed: number;
}

export type DownloadItem = CamelCasedProperties<RawDownloadItem>;

export interface RawDownloadHistoryItem {
    web_link: string;
    web_title: string;
    web_sub_title: string;
    file_title: string;
    volume_id: number;
    issue_id: number;
    source: string;
    downloaded_at: number;
}

export type DownloadHistoryItem = CamelCasedProperties<RawDownloadHistoryItem>;

export interface RawBlocklistItem {
    id: number;
    volume_id: number | null;
    issue_id: number | null;

    web_link: string | null;
    web_title: string | null;
    web_sub_title: string | null;

    download_link: string | null;
    source: string | null;

    reason: string;
    added_at: number;
}

export type BlocklistItem = CamelCasedProperties<RawBlocklistItem>;
