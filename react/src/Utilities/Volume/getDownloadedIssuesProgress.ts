import { downloadStates, type DownloadState } from 'Helpers/Props/downloadStates';
import getProgressBarKind from './getProgressBarKind';

import type { DownloadItem } from 'typings/Queue';
import type { VolumePublicInfo } from 'Volume/Volume';

interface GetDownloadedIssuesProgressParams {
    queue: DownloadItem[];
    volume: VolumePublicInfo;
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
    const { issuesDownloadedMonitored, issueCountMonitored } = volume;

    const newDownloads =
        queue.length - queue.filter((item) => FAILED_STATE.includes(item.status)).length;

    const progress = issueCountMonitored
        ? (issuesDownloadedMonitored / issuesDownloadedMonitored) * 100
        : 100;
    const text = newDownloads
        ? `${issuesDownloadedMonitored} + ${newDownloads} / ${issueCountMonitored}`
        : `${issuesDownloadedMonitored} / ${issueCountMonitored}`;

    const kind = getProgressBarKind(volume.monitored, progress, queue.length > 0);

    return {
        issueCount: issueCountMonitored,
        issueFileCount: issuesDownloadedMonitored,
        kind,
        progress,
        text,
    };
}

export default getDownloadedIssuesProgress;
