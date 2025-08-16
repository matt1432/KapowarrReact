import { downloadStates, type DownloadState } from 'Helpers/Props/downloadStates';
import getProgressBarKind from './getProgressBarKind';

import type { DownloadItem } from 'typings/Queue';
import type { Volume } from 'Volume/Volume';

interface GetDownloadedIssuesProgressParams {
    queue: DownloadItem[];
    volume: Volume;
}

interface GetDownloadedIssuesProgressReturn {
    issueCount: number;
    issueFileCount: number;
    kind: ReturnType<typeof getProgressBarKind>;
    progress: number;
    text: string;
}

const FAILED_STATE: DownloadState[] = [
    downloadStates.FAILED,
    downloadStates.CANCELED,
    downloadStates.SHUTDOWN,
];

export function getDownloadedIssuesProgress({
    queue,
    volume,
}: GetDownloadedIssuesProgressParams): GetDownloadedIssuesProgressReturn {
    const { issues, issuesDownloaded: issueFileCount } = volume;

    const issueCount = issues.filter(
        (issue) => issue.monitored || issue.files.some((f) => !f.isMetadataFile && !f.isImageFile),
    ).length;

    const newDownloads =
        queue.length - queue.filter((item) => FAILED_STATE.includes(item.status)).length;

    const progress = issueCount ? (issueFileCount / issueCount) * 100 : 100;
    const text = newDownloads
        ? `${issueFileCount} + ${newDownloads} / ${issueCount}`
        : `${issueFileCount} / ${issueCount}`;

    const kind = getProgressBarKind(volume.monitored, progress, queue.length > 0);

    return {
        issueCount,
        issueFileCount,
        kind,
        progress,
        text,
    };
}

export default getDownloadedIssuesProgress;
