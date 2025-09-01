import type { DownloadState } from 'Helpers/Props/downloadStates';

// FIXME: this type is incomplete
export interface DownloadItem {
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
