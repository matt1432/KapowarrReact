// import { useSelector } from 'react-redux';
import ProgressBar from 'Components/ProgressBar';
import { sizes } from 'Helpers/Props';
/*import createVolumesQueueItemsDetailsSelector, {
    type VolumesQueueDetails,
} from 'Volumes/Index/createVolumesQueueDetailsSelector';*/
// import { type VolumesStatus } from 'Volumes/Volumes';
import getProgressBarKind from 'Utilities/Volumes/getProgressBarKind';
import translate from 'Utilities/String/translate';
import styles from './VolumesIndexProgressBar.module.css';

interface VolumesIndexProgressBarProps {
    volumesId: number;
    seasonNumber?: number;
    monitored: boolean;
    status: string; // VolumesStatus;
    issueCount: number;
    issueFileCount: number;
    totalIssueCount: number;
    width: number;
    detailedProgressBar: boolean;
    isStandalone: boolean;
}

function VolumesIndexProgressBar(props: VolumesIndexProgressBarProps) {
    const {
        // volumesId,
        // seasonNumber,
        monitored,
        status,
        issueCount,
        issueFileCount,
        totalIssueCount,
        width,
        detailedProgressBar,
        isStandalone,
    } = props;

    /*
    const queueDetails: VolumesQueueDetails = useSelector(
        createVolumesQueueItemsDetailsSelector(volumesId, seasonNumber),
    );
    */

    const newDownloads = 0; // queueDetails.count - queueDetails.issuesWithFiles;
    const progress = issueCount ? (issueFileCount / issueCount) * 100 : 100;
    const text = newDownloads
        ? `${issueFileCount} + ${newDownloads} / ${issueCount}`
        : `${issueFileCount} / ${issueCount}`;

    return (
        <ProgressBar
            className={styles.progressBar}
            containerClassName={isStandalone ? undefined : styles.progress}
            progress={progress}
            kind={getProgressBarKind(status, monitored, progress, false /*queueDetails.count > 0*/)}
            size={detailedProgressBar ? sizes.MEDIUM : sizes.SMALL}
            showText={detailedProgressBar}
            text={text}
            title={translate('VolumesProgressBarText', {
                issueFileCount,
                issueCount,
                totalIssueCount,
                downloadingCount: 0, // queueDetails.count,
            })}
            width={width}
        />
    );
}

export default VolumesIndexProgressBar;
