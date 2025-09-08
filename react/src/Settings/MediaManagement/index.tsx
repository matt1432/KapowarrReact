// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useGetSettingsQuery, useSaveSettingsMutation } from 'Store/Api/Settings';

// Hooks
import { inputTypes } from 'Helpers/Props';

import translate, { type TranslateKey } from 'Utilities/String/translate';

// General Components
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import FormInputGroup from 'Components/Form/FormInputGroup';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// Specific Components
import FormatPreferenceInput from './FormatPreferenceInput';
import SettingsToolbar from 'Settings/SettingsToolbar';

// CSS
import styles from './index.module.css';

// Types
import type { SettingsValue } from 'typings/Settings';
import type { InputChanged } from 'typings/Inputs';
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';

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
    const { settings, isSuccess } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data, isSuccess }) => ({
            settings: data,
            isSuccess,
        }),
    });

    const [saveSettings] = useSaveSettingsMutation();

    const [isSaving, setIsSaving] = useState(false);
    const [changes, setChanges] = useState<SettingsValue>(settings!);

    useEffect(() => {
        if (isSuccess) {
            setIsSaving(false);
            setChanges(settings!);
        }
    }, [isSuccess, settings]);

    const onSavePress = useCallback(() => {
        setIsSaving(true);
        saveSettings(changes);
    }, [changes, saveSettings]);

    const handleInputChange = useCallback(
        <Key extends keyof SettingsValue>({
            name,
            value,
        }: InputChanged<Key, SettingsValue[Key]>) => {
            setChanges({
                ...changes,
                [name]: value,
            });
        },
        [changes],
    );

    const hasPendingChanges = useMemo(() => {
        return JSON.stringify(changes) !== JSON.stringify(settings);
    }, [changes, settings]);

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
                            <FormLabel>{translate('ReplaceIllegalCharacters')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="replaceIllegalCharacters"
                                helpText={translate('ReplaceIllegalCharactersHelpText')}
                                onChange={handleInputChange}
                                value={changes.replaceIllegalCharacters}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('VolumeFolderNaming')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.TEXT}
                                name="volumeFolderNaming"
                                helpText={translate('VolumeFolderNamingHelpText')}
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
                            <FormLabel>{translate('FileNamingEmpty')}</FormLabel>
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
                                onChange={handleInputChange<'issuePadding'>}
                                value={changes.issuePadding}
                                values={issuePaddingOptions}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('VolumePadding')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="volumePadding"
                                onChange={handleInputChange<'volumePadding'>}
                                value={changes.volumePadding}
                                values={volumePaddingOptions}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('Folders')}>
                        <FormGroup>
                            <FormLabel>{translate('CreateEmptyVolumeFolders')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="createEmptyVolumeFolders"
                                helpText={translate('CreateEmptyVolumeFoldersHelpText')}
                                onChange={handleInputChange}
                                value={changes.createEmptyVolumeFolders}
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>{translate('DeleteEmptyFolders')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="deleteEmptyFolders"
                                helpText={translate('DeleteEmptyVolumeFoldersHelpText')}
                                onChange={handleInputChange}
                                value={changes.deleteEmptyFolders}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('FileManagement')}>
                        <FormGroup>
                            <FormLabel>{translate('UnmonitorDeletedIssues')}</FormLabel>
                            <FormInputGroup
                                type={inputTypes.CHECK}
                                name="unmonitorDeletedIssues"
                                helpText={translate('UnmonitorDeletedIssuesHelpText')}
                                onChange={handleInputChange}
                                value={changes.unmonitorDeletedIssues}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet
                        legend={
                            <div className={styles.legend}>
                                <span className={styles.title}>{translate('Converting')}</span>
                                <span className={styles.subtitle}>
                                    {translate('ConvertingInfo')}
                                </span>
                            </div>
                        }
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
                            <FormLabel>{translate('FormatPreference')}</FormLabel>
                            <FormatPreferenceInput
                                helpText={translate('FormatPreferenceHelpText')}
                                onChange={(v) =>
                                    handleInputChange({ name: 'formatPreference', value: v })
                                }
                                value={changes.formatPreference as TranslateKey[]}
                            />
                        </FormGroup>
                    </FieldSet>

                    <FieldSet legend={translate('RootFolders')}></FieldSet>
                </Form>

                {/* TODO:
                <h2>Root Folders</h2>
                <div id="root-folder-container">
                    <table id="root-folder-table" className="icon-text-color">
                        <thead>
                            <tr>
                                <th>Path</th>
                                <th className="number-column">Free Space</th>
                                <th className="number-column">Total Space</th>
                                <th className="action-column">Action</th>
                            </tr>
                        </thead>
                        <tbody id="root-folder-list"></tbody>
                        <tbody>
                            <tr id="add-row" className="hidden">
                                <td>
                                    <input type="text" id="folder-input" />
                                    <p className="error" id="folder-error">
                                        *Folder doesn't exist
                                    </p>
                                    <p className="error" id="folder-in-folder-error">
                                        *Folder is in other root folder or download folder
                                    </p>
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    <button id="add-folder" type="button">
                                        Add
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button type="button" id="toggle-root-folder">
                    Add Root Folder
                </button> */}
            </PageContentBody>
        </PageContent>
    );
}
