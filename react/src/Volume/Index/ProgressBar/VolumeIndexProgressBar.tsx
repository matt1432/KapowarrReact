// IMPORTS

// Redux
import { useFetchQueueDetails } from 'Store/createApiEndpoints';

// Misc
import { sizes } from 'Helpers/Props';

import getDownloadedIssuesProgress from 'Utilities/Volume/getDownloadedIssuesProgress';
import translate from 'Utilities/String/translate';

// General Components
import ProgressBar from 'Components/ProgressBar';

// CSS
import styles from './VolumeIndexProgressBar.module.css';

// Types
import type { Volume } from 'Volume/Volume';

interface VolumeIndexProgressBarProps {
    volume: Volume;
    width: number;
    detailedProgressBar: boolean;
    isStandalone: boolean;
}

// IMPLEMENTATIONS

function VolumeIndexProgressBar({
    volume,
    width,
    detailedProgressBar,
    isStandalone,
}: VolumeIndexProgressBarProps) {
    const { queue } = useFetchQueueDetails({ volumeId: volume.id });

    const { issueCount, issueFileCount, kind, progress, text } = getDownloadedIssuesProgress({
        queue,
        volume,
    });

    return (
        <ProgressBar
            className={styles.progressBar}
            containerClassName={isStandalone ? undefined : styles.progress}
            progress={progress}
            kind={kind}
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
