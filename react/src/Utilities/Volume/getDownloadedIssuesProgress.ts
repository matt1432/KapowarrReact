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

export function getDownloadedIssuesProgress({
    queue,
    volume,
}: GetDownloadedIssuesProgressParams): GetDownloadedIssuesProgressReturn {
    const { issues, issues_downloaded: issueFileCount } = volume;

    const issueCount = issues.filter(
        (issue) =>
            issue.monitored || issue.files.some((f) => !f.is_metadata_file && !f.is_image_file),
    ).length;

    const newDownloads =
        queue.length -
        queue.filter((item) => ['failed', 'canceled', 'shutting down'].includes(item.status))
            .length;

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
