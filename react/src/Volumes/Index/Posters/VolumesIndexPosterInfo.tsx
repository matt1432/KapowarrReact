import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

import type { IndexSort } from '..';

import styles from './VolumesIndexPosterInfo.module.css';

interface VolumesIndexPosterInfoProps {
    publisher?: string;
    folder: string;
    sizeOnDisk?: number;
    sortKey: IndexSort;
}

function VolumesIndexPosterInfo(props: VolumesIndexPosterInfoProps) {
    const { publisher, folder, sizeOnDisk = 0, sortKey } = props;

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

export default VolumesIndexPosterInfo;
