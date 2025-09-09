// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useGetDownloadClientsQuery } from 'Store/Api/DownloadClients';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Card from 'Components/Card';
import Icon from 'Components/Icon';
import PageSectionContent from 'Components/Page/PageSectionContent';

// Specific Components
import AddDownloadClientModal from '../AddDownloadClient';
import DownloadClient from '../DownloadClient';
import EditDownloadClientModal from '../EditDownloadClient';

// CSS
import styles from './index.module.css';

// Types
import type { ClientType } from 'typings/DownloadClient';

// IMPLEMENTATIONS

export default function DownloadClients() {
    const { error, isFetching, isUninitialized, data: items = [] } = useGetDownloadClientsQuery();

    const [newClientType, setNewClientType] = useState<ClientType | undefined>(undefined);

    const [isAddDownloadClientModalOpen, setIsAddDownloadClientModalOpen] = useState(false);

    const [isEditDownloadClientModalOpen, setIsEditDownloadClientModalOpen] = useState(false);

    const handleAddDownloadClientPress = useCallback(() => {
        setIsAddDownloadClientModalOpen(true);
    }, []);

    const handleDownloadClientSelect = useCallback((clientType: ClientType) => {
        setNewClientType(clientType);
        setIsAddDownloadClientModalOpen(false);
        setIsEditDownloadClientModalOpen(true);
    }, []);

    const handleAddDownloadClientModalClose = useCallback(() => {
        setIsAddDownloadClientModalOpen(false);
    }, []);

    const handleEditDownloadClientModalClose = useCallback(() => {
        setIsEditDownloadClientModalOpen(false);
    }, []);

    return (
        <PageSectionContent
            errorMessage={translate('DownloadClientsLoadError')}
            error={error}
            isFetching={isFetching}
            isPopulated={!isUninitialized}
        >
            <div className={styles.downloadClients}>
                {items.map((item) => {
                    return <DownloadClient key={item.id} {...item} />;
                })}

                <Card className={styles.addDownloadClient} onPress={handleAddDownloadClientPress}>
                    <div className={styles.center}>
                        <Icon name={icons.ADD} size={45} />
                    </div>
                </Card>
            </div>

            <AddDownloadClientModal
                isOpen={isAddDownloadClientModalOpen}
                onDownloadClientSelect={handleDownloadClientSelect}
                onModalClose={handleAddDownloadClientModalClose}
            />

            <EditDownloadClientModal
                clientType={newClientType}
                isOpen={isEditDownloadClientModalOpen}
                onModalClose={handleEditDownloadClientModalClose}
            />
        </PageSectionContent>
    );
}
