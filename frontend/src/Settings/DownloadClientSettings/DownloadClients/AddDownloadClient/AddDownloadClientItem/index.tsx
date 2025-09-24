// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
import type { ClientType } from 'typings/DownloadClient';

interface AddDownloadClientItemProps {
    clientType: ClientType;
    onDownloadClientSelect: (clientType: ClientType) => void;
}

// IMPLEMENTATIONS

export default function AddDownloadClientItem({
    clientType,
    onDownloadClientSelect,
}: AddDownloadClientItemProps) {
    const handleDownloadClientSelect = useCallback(() => {
        onDownloadClientSelect(clientType);
    }, [clientType, onDownloadClientSelect]);

    return (
        <div className={styles.downloadClient}>
            <Link
                className={styles.underlay}
                onPress={handleDownloadClientSelect}
            />

            <div className={styles.overlay}>
                <div className={styles.name}>{clientType}</div>
            </div>
        </div>
    );
}
