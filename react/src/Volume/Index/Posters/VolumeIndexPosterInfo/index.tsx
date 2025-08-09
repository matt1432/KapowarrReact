// IMPORTS

// Misc
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// CSS
import styles from './index.module.css';

// Types
import type { IndexSort } from '../..';

interface VolumeIndexPosterInfoProps {
    publisher?: string;
    folder: string;
    sizeOnDisk?: number;
    sortKey: IndexSort;
}

// IMPLEMENTATIONS

function VolumeIndexPosterInfo({
    publisher,
    folder,
    sizeOnDisk = 0,
    sortKey,
}: VolumeIndexPosterInfoProps) {
    if (sortKey === 'publisher' && publisher) {
        return (
            <div className={styles.info} title={translate('Publisher')}>
                {publisher}
            </div>
        );
    }

    if (sortKey === 'folder') {
        return (
            <div className={styles.info} title={translate('Folder')}>
                {folder}
            </div>
        );
    }

    if (sortKey === 'total_size') {
        return (
            <div className={styles.info} title={translate('SizeOnDisk')}>
                {formatBytes(sizeOnDisk)}
            </div>
        );
    }

    return null;
}

export default VolumeIndexPosterInfo;
