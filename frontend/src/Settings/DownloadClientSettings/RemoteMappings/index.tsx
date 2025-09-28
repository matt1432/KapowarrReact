// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useGetDownloadClientsQuery } from 'Store/Api/DownloadClients';
import { useGetRemoteMappingsQuery } from 'Store/Api/RootFolders';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import PageSectionContent from 'Components/Page/PageSectionContent';

// Specific Components
import EditRemoteMappingModal from './EditRemoteMappingModal';
import RemoteMapping from './RemoteMapping';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function RemoteMappings() {
    const { clientMap } = useGetDownloadClientsQuery(undefined, {
        selectFromResult: ({ data = [] }) => ({
            clientMap: Object.fromEntries(
                data.map(({ id, title }) => [id, title]),
            ) as Record<number, string>,
        }),
    });

    const { isFetching, isPopulated, error, items } = useGetRemoteMappingsQuery(
        undefined,
        {
            selectFromResult: ({
                data,
                isFetching,
                isUninitialized,
                error,
            }) => ({
                items: data ?? [],
                isFetching,
                isPopulated: !isUninitialized,
                error,
            }),
        },
    );

    const [isAddRemoteMappingModalOpen, setIsAddRemoteMappingModalOpen] =
        useState(false);

    const handleAddRemoteMappingPress = useCallback(() => {
        setIsAddRemoteMappingModalOpen(true);
    }, []);

    const handleAddRemoteMappingModalClose = useCallback(() => {
        setIsAddRemoteMappingModalOpen(false);
    }, []);

    return (
        <FieldSet legend={translate('RemoteMappings')}>
            <PageSectionContent
                errorMessage={translate('RemoteMappingsLoadError')}
                error={error}
                isFetching={isFetching}
                isPopulated={isPopulated}
            >
                <div className={styles.remotePathMappingsHeader}>
                    <div className={styles.host}>{translate('Host')}</div>
                    <div className={styles.path}>{translate('RemotePath')}</div>
                    <div className={styles.path}>{translate('LocalPath')}</div>
                </div>

                <div>
                    {items.map(({ id, externalDownloadClientId, ...paths }) => {
                        return (
                            <RemoteMapping
                                key={id}
                                id={id}
                                host={clientMap[id]}
                                {...paths}
                            />
                        );
                    })}
                </div>

                <div className={styles.addRemoteMapping}>
                    <Link
                        className={styles.addButton}
                        onPress={handleAddRemoteMappingPress}
                    >
                        <Icon name={icons.ADD} />
                    </Link>
                </div>

                <EditRemoteMappingModal
                    isOpen={isAddRemoteMappingModalOpen}
                    onModalClose={handleAddRemoteMappingModalClose}
                />
            </PageSectionContent>
        </FieldSet>
    );
}
