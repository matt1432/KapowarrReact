// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc

// Types
import type { RootFolder } from 'typings/RootFolder';
import type { MonitoringScheme, SpecialVersion } from 'Volume/Volume';

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

const addVolumeSlice = createSlice({
    name: 'addVolume',
    initialState,
    selectors: {},
    reducers: {
        setAddVolumeOption: <K extends keyof AddVolumeState>(
            state: AddVolumeState,
            { payload }: PayloadAction<{ key: K; value: AddVolumeState[K] }>,
        ) => {
            state = Object.assign(state, payload);
        },
    },
});

export const setAddVolumeOption = <K extends keyof AddVolumeState>(
    key: K,
    value: AddVolumeState[K],
) => addVolumeSlice.actions.setAddVolumeOption({ key, value });

export default addVolumeSlice;
