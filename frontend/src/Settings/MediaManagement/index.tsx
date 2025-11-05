// IMPORTS

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useEditSettings from 'Settings/useEditSettings';

// General Components
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import FormInputGroup from 'Components/Form/FormInputGroup';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import SettingsToolbar from 'Settings/SettingsToolbar';

// Specific Components
import AddRootFolder from './AddRootFolder';
import FormatPreferenceInput from './FormatPreferenceInput';
import RootFolders from './RootFolders';

// Types
import type { TranslateKey } from 'Utilities/String/translate';
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputHelpText from 'Components/Form/FormInputHelpText';
import { useCallback } from 'react';
import { useEmptyThumbnailsFolderMutation } from 'Store/Api/Settings';

// IMPLEMENTATIONS

const issuePaddingOptions: EnhancedSelectInputValue<number>[] = [
    { key: 4, value: '000x' },
    { key: 3, value: '00x' },
    { key: 2, value: '0x' },
    { key: 1, value: 'x' },
];

const volumePaddingOptions: EnhancedSelectInputValue<number>[] = [
    { key: 3, value: '00x' },
    { key: 2, value: '0x' },
    { key: 1, value: 'x' },
];

export default function MediaManagement() {
    const {
        isSaving,
        hasPendingChanges,
        onSavePress,
        handleInputChange,
        changes,
    } = useEditSettings();

    const [emptyThumbnailsFolder] = useEmptyThumbnailsFolderMutation();
    const onEmptyThumbnailsFolderPress = useCallback(() => {
        emptyThumbnailsFolder();
    }, [emptyThumbnailsFolder]);

    return (
        <PageContent title={translate('MediaManagementSettings')}>
            <SettingsToolbar
                isSaving={isSaving}
                hasPendingChanges={hasPendingChanges}
                onSavePress={onSavePress}
            />

            <PageContentBody>
                <Form id="mediaManagementSettings">
                    <FieldSet legend={translate('NamingSettings')}>
                        <FormGroup>
                            <FormLabel>{translate('RenameFiles')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="renameDownloadedFiles"
                                onChange={handleInputChange}
                                value={changes.renameDownloadedFiles}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>
                                {translate('ReplaceIllegalCharacters')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="replaceIllegalCharacters"
                                helpText={translate(
                                    'ReplaceIllegalCharactersHelpText',
                                )}
                                onChange={handleInputChange}
                                value={changes.replaceIllegalCharacters}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>
                                {translate('VolumeFolderNaming')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="volumeFolderNaming"
                                helpText={translate(
                                    'VolumeFolderNamingHelpText',
                                )}
                                onChange={handleInputChange}
                                value={changes.volumeFolderNaming}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('FileNaming')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="fileNaming"
                                helpText={translate('FileNamingHelpText')}
                                onChange={handleInputChange}
                                value={changes.fileNaming}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>
                                {translate('FileNamingEmpty')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="fileNamingEmpty"
                                helpText={translate('FileNamingEmptyHelpText')}
                                onChange={handleInputChange}
                                value={changes.fileNamingEmpty}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('FileNamingSV')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="fileNamingSpecialVersion"
                                helpText={translate('FileNamingSVHelpText')}
                                onChange={handleInputChange}
                                value={changes.fileNamingSpecialVersion}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('FileNamingVAI')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="fileNamingVai"
                                helpText={translate('FileNamingVAIHelpText')}
                                onChange={handleInputChange}
                                value={changes.fileNamingVai}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('LongSVLabels')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="longSpecialVersion"
                                helpText={translate('LongSVLabelsHelpText')}
                                onChange={handleInputChange}
                                value={changes.longSpecialVersion}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('IssuePadding')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="issuePadding"
                                onChange={handleInputChange}
                                value={changes.issuePadding}
                                values={issuePaddingOptions}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('VolumePadding')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="volumePadding"
                                onChange={handleInputChange}
                                value={changes.volumePadding}
                                values={volumePaddingOptions}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('Folders')}>
                        <FormGroup>
                            <FormLabel>
                                {translate('CreateEmptyVolumeFolders')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="createEmptyVolumeFolders"
                                helpText={translate(
                                    'CreateEmptyVolumeFoldersHelpText',
                                )}
                                onChange={handleInputChange}
                                value={changes.createEmptyVolumeFolders}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>
                                {translate('DeleteEmptyFolders')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="deleteEmptyFolders"
                                helpText={translate(
                                    'DeleteEmptyVolumeFoldersHelpText',
                                )}
                                onChange={handleInputChange}
                                value={changes.deleteEmptyFolders}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('FileManagement')}>
                        <FormGroup>
                            <FormLabel>
                                {translate('UnmonitorDeletedIssues')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="unmonitorDeletedIssues"
                                helpText={translate(
                                    'UnmonitorDeletedIssuesHelpText',
                                )}
                                onChange={handleInputChange}
                                value={changes.unmonitorDeletedIssues}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('AdRemoval')}>
                        <FormGroup>
                            <FormLabel>
                                {translate('AdRemovalToggle')}
                            </FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="removeAds"
                                helpText={translate('AdRemovalToggleHelpText')}
                                onChange={handleInputChange}
                                value={changes.removeAds}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('EditPages')}>
                        <FormGroup>
                            <FormLabel>
                                {translate('ThumbnailsFolderEmpty')}
                            </FormLabel>
                            <div>
                                <FormInputButton
                                    style={{
                                        borderLeft: 'currentColor',
                                        borderTopLeftRadius: '4px',
                                        borderBottomLeftRadius: '4px',
                                    }}
                                    onPress={onEmptyThumbnailsFolderPress}
                                >
                                    {translate('Reset')}
                                </FormInputButton>
                                <FormInputHelpText
                                    text={translate(
                                        'ThumbnailsFolderEmptyHelpText',
                                    )}
                                />
                            </div>
                        </FormGroup>
                    </FieldSet>

                    <FieldSet
                        legend={translate('Converting')}
                        subLegend={translate('ConvertingInfo')}
                    >
                        <FormGroup>
                            <FormLabel>{translate('ConvertToggle')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="convert"
                                helpText={translate('ConvertToggleHelpText')}
                                onChange={handleInputChange}
                                value={changes.convert}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('ExtractIssues')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="extractIssueRanges"
                                helpText={translate('ExtractIssuesHelpText')}
                                onChange={handleInputChange}
                                value={changes.extractIssueRanges}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>
                                {translate('FormatPreference')}
                            </FormLabel>
                            <FormatPreferenceInput
                                helpText={translate('FormatPreferenceHelpText')}
                                onChange={(v) =>
                                    handleInputChange({
                                        name: 'formatPreference',
                                        value: v,
                                    })
                                }
                                value={
                                    changes.formatPreference as TranslateKey[]
                                }
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('RootFolders')}>
                        <RootFolders />
                        <AddRootFolder />
                    </FieldSet>
                </Form>
            </PageContentBody>
        </PageContent>
    );
}
