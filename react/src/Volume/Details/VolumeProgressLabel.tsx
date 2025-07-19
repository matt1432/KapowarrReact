// IMPORTS

// Redux
import { useFetchQueueDetails, useSearchVolumeQuery } from 'Store/createApiEndpoints';

// Misc
import { kinds, sizes } from 'Helpers/Props';

// General Components
import Label from 'Components/Label';

// Types
interface VolumeProgressLabelProps {
    className: string;
    volumeId: number;
    monitored: boolean;
    issueCount: number;
    issueFileCount: number;
}

// IMPLEMENTATIONS

function getIssueCountKind(
    monitored: boolean,
    issueFileCount: number,
    issueCount: number,
    isDownloading: boolean,
) {
    if (isDownloading) {
        return kinds.PURPLE;
    }

    if (issueFileCount === issueCount && issueCount > 0) {
        return kinds.SUCCESS;
    }

    if (!monitored) {
        return kinds.WARNING;
    }

    return kinds.DANGER;
}

function useIssuesSelector(volumeId: number) {
    const { issues } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data, ...rest }) => ({
                issues: data?.issues ?? [],
                ...rest,
            }),
        },
    );

    return {
        issues,
    };
}

function VolumeProgressLabel({
    className,
    volumeId,
    monitored,
    issueCount,
    issueFileCount,
}: VolumeProgressLabelProps) {
    const { issues } = useIssuesSelector(volumeId);
    const { queue } = useFetchQueueDetails(volumeId);

    const newDownloads =
        queue.length -
        queue.filter(
            (item) => (issues.find(({ id }) => id === item.issue_id)?.files.length ?? 0) !== 0,
        ).length;

    const text = newDownloads
        ? `${issueFileCount} + ${newDownloads} / ${issueCount}`
        : `${issueFileCount} / ${issueCount}`;

    return (
        <Label
            className={className}
            kind={getIssueCountKind(monitored, issueFileCount, issueCount, queue.length > 0)}
            size={sizes.LARGE}
        >
            <span>{text}</span>
        </Label>
    );
}

export default VolumeProgressLabel;
