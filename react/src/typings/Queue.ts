import type { ModelBase } from 'App/ModelBase';
import type { DownloadProtocol } from 'DownloadClient/DownloadProtocol';
import type { Issue } from 'Issue/Issue';
export type QueueTrackedDownloadStatus = 'ok' | 'warning' | 'error';

export type QueueTrackedDownloadState =
    | 'downloading'
    | 'importBlocked'
    | 'importPending'
    | 'importing'
    | 'imported'
    | 'failedPending'
    | 'failed'
    | 'ignored';

export interface StatusMessage {
    title: string;
    messages: string[];
}

export interface Queue extends ModelBase {
    size: number;
    title: string;
    sizeleft: number;
    timeleft: string;
    estimatedCompletionTime: string;
    added?: string;
    status: string;
    trackedDownloadStatus: QueueTrackedDownloadStatus;
    trackedDownloadState: QueueTrackedDownloadState;
    statusMessages: StatusMessage[];
    errorMessage: string;
    downloadId: string;
    protocol: DownloadProtocol;
    downloadClient: string;
    outputPath: string;
    issueHasFile: boolean;
    volumeId?: number;
    issueId?: number;
    downloadClientHasPostImportCategory: boolean;
    issue?: Issue;
}

export interface DownloadItem extends ModelBase {
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
    status: string;
    progress: number;
    speed: number;
}
