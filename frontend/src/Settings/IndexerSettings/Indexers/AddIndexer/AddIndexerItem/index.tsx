// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
import type { IndexerClientType } from 'typings/Indexer';

interface AddIndexerItemProps {
    clientType: IndexerClientType;
    onIndexerSelect: (clientType: IndexerClientType) => void;
}

// IMPLEMENTATIONS

export default function AddIndexerItem({
    clientType,
    onIndexerSelect,
}: AddIndexerItemProps) {
    const handleIndexerSelect = useCallback(() => {
        onIndexerSelect(clientType);
    }, [clientType, onIndexerSelect]);

    return (
        <div className={styles.indexer}>
            <Link className={styles.underlay} onPress={handleIndexerSelect} />

            <div className={styles.overlay}>
                <div className={styles.name}>{clientType}</div>
            </div>
        </div>
    );
}
