import { useSelector } from 'react-redux';
import ProgressBar from 'Components/ProgressBar';
import { sizes } from 'Helpers/Props';
import createComicsQueueItemsDetailsSelector, {
    type ComicsQueueDetails,
} from 'Comics/Index/createComicsQueueDetailsSelector';
import { type ComicsStatus } from 'Comics/Comics';
import getProgressBarKind from 'Utilities/Comics/getProgressBarKind';
import translate from 'Utilities/String/translate';
import styles from './ComicsIndexProgressBar.module.css';

interface ComicsIndexProgressBarProps {
    comicsId: number;
    seasonNumber?: number;
    monitored: boolean;
    status: ComicsStatus;
    issueCount: number;
    issueFileCount: number;
    totalIssueCount: number;
    width: number;
    detailedProgressBar: boolean;
    isStandalone: boolean;
}

function ComicsIndexProgressBar(props: ComicsIndexProgressBarProps) {
    const {
        comicsId,
        seasonNumber,
        monitored,
        status,
        issueCount,
        issueFileCount,
        totalIssueCount,
        width,
        detailedProgressBar,
        isStandalone,
    } = props;

    const queueDetails: ComicsQueueDetails = useSelector(
        createComicsQueueItemsDetailsSelector(comicsId, seasonNumber),
    );

    const newDownloads = queueDetails.count - queueDetails.issuesWithFiles;
    const progress = issueCount ? (issueFileCount / issueCount) * 100 : 100;
    const text = newDownloads
        ? `${issueFileCount} + ${newDownloads} / ${issueCount}`
        : `${issueFileCount} / ${issueCount}`;

    return (
        <ProgressBar
            className={styles.progressBar}
            containerClassName={isStandalone ? undefined : styles.progress}
            progress={progress}
            kind={getProgressBarKind(status, monitored, progress, queueDetails.count > 0)}
            size={detailedProgressBar ? sizes.MEDIUM : sizes.SMALL}
            showText={detailedProgressBar}
            text={text}
            title={translate('ComicsProgressBarText', {
                issueFileCount,
                issueCount,
                totalIssueCount,
                downloadingCount: queueDetails.count,
            })}
            width={width}
        />
    );
}

export default ComicsIndexProgressBar;
