// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setImportVolumeOption } from 'Store/Slices/ImportVolume';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';

// Specific Components
import FolderTable from './FolderTable';

// CSS
import styles from './index.module.css';

// Types
import type { ImportVolumeState } from 'Store/Slices/ImportVolume';
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import type { InputChanged } from 'typings/Inputs';
import type { GetImportProposalsParams } from 'Store/Api/Volumes';
import FormInputHelpText from 'Components/Form/FormInputHelpText';

interface ImportFormProps {
    onScanPress: (params: GetImportProposalsParams) => void;
}

// IMPLEMENTATIONS

const maxFoldersScannedOptions: EnhancedSelectInputValue<number>[] = [
    { key: 1, value: '1' },
    { key: 5, value: '5' },
    { key: 20, value: '20' },
    { key: 100, value: '100' },
    { key: 500, value: '500' },
];

export default function ImportForm({ onScanPress }: ImportFormProps) {
    const dispatch = useRootDispatch();

    const {
        applyLimitToParentFolder,
        maxFoldersScanned,
        onlyMatchEnglishVolumes,
        scanSpecificFolders,
        includedFolders = [],
        excludedFolders = [],
    } = useRootSelector((state) => state.importVolume);

    const handleInputChange = useCallback(
        <Key extends keyof ImportVolumeState>({
            name,
            value,
        }: InputChanged<Key, ImportVolumeState[Key]>) => {
            dispatch(setImportVolumeOption(name, value));
        },
        [dispatch],
    );

    const handleScanPress = useCallback(() => {
        const params: GetImportProposalsParams = {
            limitParentFolder: applyLimitToParentFolder,
            limit: maxFoldersScanned,
            onlyEnglish: onlyMatchEnglishVolumes,
        };

        if (scanSpecificFolders) {
            if (includedFolders.length !== 0) {
                params.includedFolders = includedFolders;
            }
            if (excludedFolders.length !== 0) {
                params.excludedFolders = excludedFolders;
            }
        }

        onScanPress(params);
    }, [
        applyLimitToParentFolder,
        maxFoldersScanned,
        onlyMatchEnglishVolumes,
        onScanPress,
        scanSpecificFolders,
        includedFolders,
        excludedFolders,
    ]);

    return (
        <Form>
            <FormGroup>
                <FormLabel>{translate('MaxFoldersScanned')}</FormLabel>
                <FormInputGroup
                    type={inputTypes.SELECT}
                    name="maxFoldersScanned"
                    onChange={handleInputChange}
                    value={maxFoldersScanned}
                    values={maxFoldersScannedOptions}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>{translate('LimitToParent')}</FormLabel>
                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="applyLimitToParentFolder"
                    helpText={translate('LimitToParentHelpText')}
                    onChange={handleInputChange}
                    value={applyLimitToParentFolder}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>{translate('EnglishOnly')}</FormLabel>
                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="onlyMatchEnglishVolumes"
                    onChange={handleInputChange}
                    value={onlyMatchEnglishVolumes}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>{translate('ScanSpecificFolders')}</FormLabel>
                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="scanSpecificFolders"
                    helpText={translate('ScanSpecificFoldersHelpText')}
                    onChange={handleInputChange}
                    value={scanSpecificFolders}
                />
            </FormGroup>

            {scanSpecificFolders ? (
                <>
                    <FormGroup>
                        <FormLabel>{translate('IncludedFolders')}</FormLabel>
                        <div>
                            <FolderTable
                                name="includedFolders"
                                values={includedFolders}
                                onChange={handleInputChange}
                            />
                            <FormInputHelpText
                                text={translate('FolderTableHelpText')}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>{translate('ExcludedFolders')}</FormLabel>
                        <div>
                            <FolderTable
                                name="excludedFolders"
                                values={excludedFolders}
                                onChange={handleInputChange}
                            />
                            <FormInputHelpText
                                text={translate('FolderTableHelpText')}
                            />
                        </div>
                    </FormGroup>
                </>
            ) : null}

            <FormGroup className={styles.buttonGroup}>
                <Button onPress={handleScanPress}>{translate('Search')}</Button>
            </FormGroup>
        </Form>
    );
}
