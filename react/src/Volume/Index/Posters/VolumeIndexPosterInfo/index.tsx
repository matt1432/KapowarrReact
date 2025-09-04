// IMPORTS

// Misc
import translate from 'Utilities/String/translate';

// CSS
import styles from './index.module.css';

// Types
import type { IndexSort } from '../..';

interface VolumeIndexPosterInfoProps {
    publisher?: string;
    sortKey: IndexSort;
    volumeNumber: number;
    year: number;
}

// IMPLEMENTATIONS

export default function VolumeIndexPosterInfo({
    publisher,
    sortKey,
    volumeNumber,
    year,
}: VolumeIndexPosterInfoProps) {
    // 'title'
    // Already Shown

    // 'year'
    if (sortKey === 'year') {
        return (
            <div className={styles.info} title={translate('Year')}>
                {year}
            </div>
        );
    }

    // 'volume_number'
    if (sortKey === 'volume_number') {
        return (
            <div className={styles.info} title={translate('VolumeNumber')}>
                {`Volume #${volumeNumber}`}
            </div>
        );
    }

    // 'recently_added'
    // Not available through API

    // 'publisher'
    if (sortKey === 'publisher' && publisher) {
        return (
            <div className={styles.info} title={translate('Publisher')}>
                {publisher}
            </div>
        );
    }

    // 'wanted'
    // Already Shown

    // 'recently_released';
    // Not available through API

    return null;
}
