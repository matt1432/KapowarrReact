// TODO:
// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import {
    useGetDownloadClientsQuery,
    useTestDownloadClientMutation,
} from 'Store/Api/DownloadClients';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import SettingsToolbar from 'Settings/SettingsToolbar';
import DownloadClients from './DownloadClients';

// Specific Components

// CSS

// Types
import type { DownloadClient } from 'typings/DownloadClient';

// IMPLEMENTATIONS

export default function MediaManagement() {
    const { clients, hasNoClients } = useGetDownloadClientsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            clients: data ?? [],
            hasNoClients: (data?.length ?? 0) === 0,
        }),
    });

    const [testDownloadClient] = useTestDownloadClientMutation();

    const [toTest, setToTest] = useState<DownloadClient[]>([]);
    const isTestingAll = useMemo(() => toTest.length !== 0, [toTest.length]);

    const handleTestAllIndexersPress = useCallback(() => {
        setToTest(clients);
    }, [clients]);

    useEffect(() => {
        if (toTest.length === 0) {
            return;
        }

        testDownloadClient(toTest[0]).finally(() => {
            setToTest(toTest.slice(1));
        });
    }, [testDownloadClient, toTest]);

    return (
        <PageContent title={translate('DownloadClientSettings')}>
            <SettingsToolbar
                showSave={false}
                additionalButtons={
                    <PageToolbarButton
                        label={translate('TestAllClients')}
                        iconName={icons.TEST}
                        isSpinning={isTestingAll}
                        onPress={handleTestAllIndexersPress}
                        isDisabled={hasNoClients || isTestingAll}
                    />
                }
            />

            <PageContentBody>
                <FieldSet legend={translate('BuiltInClients')}>TODO:</FieldSet>

                <FieldSet legend={translate('TorrentClients')}>
                    <DownloadClients />
                </FieldSet>
            </PageContentBody>
        </PageContent>
    );
}
