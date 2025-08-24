// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
import type { RootFolder } from 'typings/RootFolder';
import type { MonitoringScheme } from 'Volume/Volume';
import type { SpecialVersion } from 'Helpers/Props/specialVersions';

export interface AddVolumeState {
    rootFolder: RootFolder | null;
    monitor: boolean;
    monitoringScheme: MonitoringScheme;
    specialVersion: SpecialVersion;
}

// IMPLEMENTATIONS

const initialState = {
    rootFolder: null,
    monitor: true,
    monitoringScheme: 'all',
    specialVersion: '' as SpecialVersion,
} satisfies AddVolumeState as AddVolumeState;

const AddVolumeSlice = createSlice({
    name: 'addVolume',
    initialState,
    reducers: {
        setAddVolumeOption: <K extends keyof AddVolumeState>(
            state: AddVolumeState,
            { payload }: PayloadAction<{ key: K; value: AddVolumeState[K] }>,
        ) => {
            state[payload.key] = payload.value;
        },
    },
});

export const setAddVolumeOption = <K extends keyof AddVolumeState>(
    key: K,
    value: AddVolumeState[K],
) => AddVolumeSlice.actions.setAddVolumeOption({ key, value });

export default AddVolumeSlice;
