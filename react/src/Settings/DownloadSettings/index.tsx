// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useEmptyDownloadFolderMutation } from 'Store/Api/Settings';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useEditSettings from 'Settings/useEditSettings';

// General Components
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormInputHelpText from 'Components/Form/FormInputHelpText';
import FormLabel from 'Components/Form/FormLabel';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import SettingsToolbar from 'Settings/SettingsToolbar';

// Specific Components

// CSS

// Types
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import ServicePreferenceInput from './ServicePreferenceInput';

// IMPLEMENTATIONS

const seedingHandlingOptions: EnhancedSelectInputValue<string>[] = [
    { key: 'complete', value: 'Complete' },
    { key: 'copy', value: 'Copy' },
];

export default function MediaManagement() {
    const {
        isSaving,
        hasPendingChanges,
        onSavePress,
        handleInputChange,
        handleNonNullInputChange,
        changes,
    } = useEditSettings();

    const [emptyDownloadFolder] = useEmptyDownloadFolderMutation();
    const onEmptyFolderPress = useCallback(() => {
        emptyDownloadFolder();
    }, [emptyDownloadFolder]);

    return (
        <PageContent title={translate('MediaManagementSettings')}>
            <SettingsToolbar
                isSaving={isSaving}
                hasPendingChanges={hasPendingChanges}
                onSavePress={onSavePress}
            />

            <PageContentBody>
                <Form id="downloadSettings">
                    <FieldSet legend={translate('DownloadLocation')}>
                        <FormGroup>
                            <FormLabel>{translate('DownloadTempFolder')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="downloadFolder"
                                helpText={translate('DownloadTempFolderHelpText')}
                                onChange={handleInputChange}
                                value={changes.downloadFolder}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('DownloadTempFolderEmpty')}</FormLabel>
                            <FormInputButton onPress={onEmptyFolderPress}>
                                {translate('Reset')}
                            </FormInputButton>
                            <FormInputHelpText
                                // FIXME: check if this is well placed
                                text={translate('DownloadTempFolderEmptyHelpText')}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('Queue')}>
                        <FormGroup>
                            <FormLabel>{translate('ConcurrentDownloads')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.NUMBER}
                                min={1}
                                name="concurrentDirectDownloads"
                                helpText={translate('ConcurrentDownloadsHelpText')}
                                onChange={handleNonNullInputChange}
                                value={changes.concurrentDirectDownloads}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('FailingDownloadTimeout')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.NUMBER}
                                name="failingDownloadTimeout"
                                helpText={translate('FailingDownloadTimeoutHelpText')}
                                onChange={handleNonNullInputChange}
                                value={changes.failingDownloadTimeout}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('SeedingHandling')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="seedingHandling"
                                helpText={translate('SeedingHandlingHelpText')}
                                onChange={handleInputChange<'seedingHandling'>}
                                value={changes.seedingHandling}
                                values={seedingHandlingOptions}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('DeleteCompletedDownloads')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="deleteCompletedDownloads"
                                helpText={translate('DeleteCompletedDownloadsHelpText')}
                                onChange={handleInputChange}
                                value={changes.deleteCompletedDownloads}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet
                        legend={translate('ServicePreference')}
                        subLegend={translate('ServicePreferenceInfo')}
                    >
                        <FormGroup>
                            <ServicePreferenceInput
                                value={changes.servicePreference}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </FieldSet>
                </Form>
            </PageContentBody>
        </PageContent>
    );
}
