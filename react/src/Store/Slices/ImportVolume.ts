// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface ImportVolumeState {
    maxFoldersScanned: number;
    applyLimitToParentFolder: boolean;
    onlyMatchEnglishVolumes: boolean;
    scanSpecificFolders: boolean;
    includedFolders: string[];
    excludedFolders: string[];
}

// IMPLEMENTATIONS

const initialState = {
    maxFoldersScanned: 20,
    applyLimitToParentFolder: false,
    onlyMatchEnglishVolumes: true,
    scanSpecificFolders: false,
    includedFolders: [],
    excludedFolders: [],
} satisfies ImportVolumeState as ImportVolumeState;

const ImportVolumeSlice = createSlice({
    name: 'importVolume',
    initialState,
    reducers: {
        setImportVolumeOption: <K extends keyof ImportVolumeState>(
            state: ImportVolumeState,
            { payload }: PayloadAction<{ key: K; value: ImportVolumeState[K] }>,
        ) => {
            state[payload.key] = payload.value;
        },
    },
});

export const setImportVolumeOption = <K extends keyof ImportVolumeState>(
    key: K,
    value: ImportVolumeState[K],
) => ImportVolumeSlice.actions.setImportVolumeOption({ key, value });

export default ImportVolumeSlice;
