// TODO:
// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import { setImportVolumeOption } from 'Store/Slices/ImportVolume';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';

// Specific Components

// CSS

// Types
import type { ImportVolumeState } from 'Store/Slices/ImportVolume';
import type { EnhancedSelectInputValue } from 'Components/Form/Select/EnhancedSelectInput';
import type { InputChanged } from 'typings/Inputs';
import Button from 'Components/Link/Button';
import type { GetImportProposalsParams } from 'Store/Api/Volumes';

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
    } = useRootSelector((state) => state.importVolume);

    const [folderSelected, setFolderSelected] = useState('');

    const handleFolderChange = useCallback(({ value }: InputChanged<string, string>) => {
        setFolderSelected(value);
    }, []);

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

        if (scanSpecificFolders && folderSelected !== '') {
            params.folderFilter = encodeURIComponent(folderSelected);
        }

        onScanPress(params);
    }, [
        applyLimitToParentFolder,
        folderSelected,
        maxFoldersScanned,
        onlyMatchEnglishVolumes,
        onScanPress,
        scanSpecificFolders,
    ]);

    return (
        <Form>
            <FormGroup>
                <FormLabel>{translate('MaxFoldersScanned')}</FormLabel>
                <FormInputGroup
                    type={inputTypes.SELECT}
                    name="maxFoldersScanned"
                    onChange={handleInputChange<'maxFoldersScanned'>}
                    value={maxFoldersScanned}
                    values={maxFoldersScannedOptions}
                />
            </FormGroup>

            <FormGroup>
                <FormLabel>{translate('LimitToParent')}</FormLabel>
                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="applyLimitToParentFolder"
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
                    onChange={handleInputChange}
                    value={scanSpecificFolders}
                />
            </FormGroup>

            {scanSpecificFolders ? (
                <FormGroup>
                    <FormInputGroup
                        type="text"
                        name="folderSelected"
                        onChange={handleFolderChange}
                        value={folderSelected}
                    />
                </FormGroup>
            ) : null}

            <Button onPress={handleScanPress}>{translate('Search')}</Button>
        </Form>
    );
}
