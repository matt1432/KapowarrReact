import { type ModelBase } from 'App/ModelBase';
import { type DownloadProtocol } from 'DownloadClient/DownloadProtocol';
import { type Issue } from 'Issue/Issue';
import { type Language } from 'Language/Language';
import { type QualityModel } from 'Quality/Quality';
import { type CustomFormat } from 'typings/CustomFormat';

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
    languages: Language[];
    quality: QualityModel;
    customFormats: CustomFormat[];
    customFormatScore: number;
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
    comicsId?: number;
    issueId?: number;
    seasonNumber?: number;
    downloadClientHasPostImportCategory: boolean;
    issue?: Issue;
}
