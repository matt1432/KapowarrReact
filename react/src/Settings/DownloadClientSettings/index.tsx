// TODO:
// IMPORTS

// React

// Redux

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import SettingsToolbar from 'Settings/SettingsToolbar';

// Specific Components

// CSS

// Types

// IMPLEMENTATIONS

export default function MediaManagement() {
    const isTestingAll = false;
    const handleTestAllIndexersPress = () => {};

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
                    />
                }
            />

            <PageContentBody>
                <FieldSet legend={translate('BuiltInClients')}></FieldSet>

                <FieldSet legend={translate('TorrentClients')}></FieldSet>
            </PageContentBody>
        </PageContent>
    );
}
