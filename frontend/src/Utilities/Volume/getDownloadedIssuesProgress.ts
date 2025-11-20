import getProgressBarKind from './getProgressBarKind';

import { downloadStates } from 'Helpers/Props';

import type { QueueItem } from 'typings/Queue';
import type { VolumePublicInfo } from 'Volume/Volume';
import type { DownloadState } from 'Helpers/Props/downloadStates';

interface GetDownloadedIssuesProgressParams {
    queue: QueueItem[];
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
    const {
        issuesDownloadedMonitored,
        issueCountMonitored,
        issueCount,
        marvelIssueCount,
    } = volume;

    const extraMarvelIssueCount =
        marvelIssueCount === 0 ? 0 : marvelIssueCount - issueCount;

    const newDownloads =
        queue.length -
        queue.filter((item) => FAILED_STATE.includes(item.status)).length;

    const progress = issueCountMonitored
        ? (issuesDownloadedMonitored / issueCountMonitored) * 100
        : 100;

    const text = newDownloads
        ? `${issuesDownloadedMonitored} + ${newDownloads} / ${issueCountMonitored}`
        : `${issuesDownloadedMonitored} / ${issueCountMonitored}`;

    const kind = getProgressBarKind(
        volume.monitored,
        progress,
        queue.length > 0,
        extraMarvelIssueCount,
    );

    return {
        issueCount: issueCountMonitored,
        issueFileCount: issuesDownloadedMonitored,
        kind,
        progress,
        text,
    };
}

export default getDownloadedIssuesProgress;
