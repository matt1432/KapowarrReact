// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import {
    useGetIndexersQuery,
    useTestIndexerMutation,
} from 'Store/Api/Indexers';

// Misc
import { icons } from 'Helpers/Props';
import downloadTypes from 'Helpers/Props/downloadTypes';

import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import SettingsToolbar from 'Settings/SettingsToolbar';

// Specific Components
import Indexers from './Indexers';

// Types
import type { Indexer } from 'typings/Indexer';

// IMPLEMENTATIONS

export default function IndexerSettings() {
    const { indexers, hasNoIndexers } = useGetIndexersQuery(undefined, {
        selectFromResult: ({ data }) => ({
            indexers: data ?? [],
            hasNoIndexers: (data?.length ?? 0) === 0,
        }),
    });

    const [testIndexer] = useTestIndexerMutation();

    const [toTest, setToTest] = useState<Indexer[]>([]);
    const isTestingAll = useMemo(() => toTest.length !== 0, [toTest.length]);

    const handleTestAllIndexersPress = useCallback(() => {
        setToTest(indexers);
    }, [indexers]);

    useEffect(() => {
        if (toTest.length === 0) {
            return;
        }

        testIndexer(toTest[0]).finally(() => {
            setToTest(toTest.slice(1));
        });
    }, [testIndexer, toTest]);

    return (
        <PageContent title={translate('IndexerSettings')}>
            <SettingsToolbar
                showSave={false}
                additionalButtons={
                    <PageToolbarButton
                        label={translate('TestAllIndexers')}
                        iconName={icons.TEST}
                        isSpinning={isTestingAll}
                        onPress={handleTestAllIndexersPress}
                        isDisabled={hasNoIndexers || isTestingAll}
                    />
                }
            />

            <PageContentBody>
                <FieldSet legend={translate('DDL')}>
                    <Indexers downloadType={downloadTypes.DIRECT} />
                </FieldSet>
            </PageContentBody>
        </PageContent>
    );
}
