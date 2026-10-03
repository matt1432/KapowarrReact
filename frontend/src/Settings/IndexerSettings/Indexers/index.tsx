// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useGetIndexersQuery } from 'Store/Api/Indexers';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Card from 'Components/Card';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';

// Specific Components
import AddIndexerModal from './AddIndexer';
import EditIndexerModal from './EditIndexer';
import Indexer from './Indexer';

// CSS
import styles from './index.module.css';

// Types
import type { DownloadType } from 'Helpers/Props/downloadTypes';
import type { IndexerClientType } from 'typings/Indexer';

interface IndexersProps {
    downloadType: DownloadType;
}

// IMPLEMENTATIONS

export default function Indexers({ downloadType }: IndexersProps) {
    const { error, isFetching, isUninitialized, items, refetch } =
        useGetIndexersQuery(undefined, {
            selectFromResult: ({ data, ...rest }) => ({
                items: (data ?? []).filter(
                    (indexer) => indexer.downloadType === downloadType,
                ),
                ...rest,
            }),
        });

    const [newClientType, setNewClientType] = useState<
        IndexerClientType | undefined
    >(undefined);

    const [isAddIndexerModalOpen, setIsAddIndexerModalOpen] = useState(false);

    const [isEditIndexerModalOpen, setIsEditIndexerModalOpen] = useState(false);

    const handleIndexersChange = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleAddIndexerPress = useCallback(() => {
        setIsAddIndexerModalOpen(true);
    }, []);

    const handleIndexerSelect = useCallback((clientType: IndexerClientType) => {
        setNewClientType(clientType);
        setIsAddIndexerModalOpen(false);
        setIsEditIndexerModalOpen(true);
    }, []);

    const handleAddIndexerModalClose = useCallback(() => {
        setIsAddIndexerModalOpen(false);
    }, []);

    const handleEditIndexerModalClose = useCallback(() => {
        setIsEditIndexerModalOpen(false);
    }, []);

    return (
        <PageSectionContent
            errorMessage={translate('IndexersLoadError')}
            error={error}
            isFetching={isFetching}
            isPopulated={!isUninitialized}
        >
            <div className={styles.indexers}>
                {items.map((item) => {
                    return (
                        <Indexer
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            enabled={item.enabled}
                            onIndexersChange={handleIndexersChange}
                        />
                    );
                })}

                <Card
                    className={styles.addIndexer}
                    onPress={handleAddIndexerPress}
                >
                    <div className={styles.center}>
                        <Icon name={icons.ADD} size={45} />
                    </div>
                </Card>
            </div>

            <AddIndexerModal
                downloadType={downloadType}
                isOpen={isAddIndexerModalOpen}
                onIndexerSelect={handleIndexerSelect}
                onModalClose={handleAddIndexerModalClose}
            />

            <EditIndexerModal
                downloadType={downloadType}
                clientType={newClientType}
                isOpen={isEditIndexerModalOpen}
                onModalClose={handleEditIndexerModalClose}
                onIndexersChange={handleIndexersChange}
            />
        </PageSectionContent>
    );
}
