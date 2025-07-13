import ProgressBar from 'Components/ProgressBar';
import { sizes } from 'Helpers/Props';
import getProgressBarKind from 'Utilities/Volume/getProgressBarKind';
import translate from 'Utilities/String/translate';
import styles from './VolumeIndexProgressBar.module.css';
import { useFetchQueueDetails } from 'Store/createApiEndpoints';

interface VolumeIndexProgressBarProps {
    volumeId: number;
    monitored: boolean;
    issueCount: number;
    issueFileCount: number;
    width: number;
    detailedProgressBar: boolean;
    isStandalone: boolean;
}

function VolumeIndexProgressBar(props: VolumeIndexProgressBarProps) {
    const {
        volumeId,
        monitored,
        issueCount,
        issueFileCount,
        width,
        detailedProgressBar,
        isStandalone,
    } = props;

    const { queue } = useFetchQueueDetails(volumeId);

    const newDownloads =
        queue.length -
        queue.filter((item) => ['failed', 'canceled', 'shutting down'].includes(item.status))
            .length;

    // FIXME: handle when there are more files than monitored issues
    const progress = issueCount ? (issueFileCount / issueCount) * 100 : 100;
    const text = newDownloads
        ? `${issueFileCount} + ${newDownloads} / ${issueCount}`
        : `${issueFileCount} / ${issueCount}`;

    return (
        <ProgressBar
            className={styles.progressBar}
            containerClassName={isStandalone ? undefined : styles.progress}
            progress={progress}
            kind={getProgressBarKind(monitored, progress, queue.length > 0)}
            size={detailedProgressBar ? sizes.MEDIUM : sizes.SMALL}
            showText={detailedProgressBar}
            text={text}
            title={translate('VolumeProgressBarText', {
                issueFileCount,
                issueCount,
                downloadingCount: queue.length,
            })}
            width={width}
        />
    );
}

export default VolumeIndexProgressBar;
