// IMPORTS

// Redux
import { createSlice } from '@reduxjs/toolkit';

// Misc

// Types
export interface SettingsState {
    advancedSettings: boolean;
}

// IMPLEMENTATIONS

const initialState = {
    advancedSettings: false,
} satisfies SettingsState as SettingsState;

const SettingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleAdvancedSettings: (state) => {
            state.advancedSettings = !state.advancedSettings;
        },
    },
});

export const { toggleAdvancedSettings } = SettingsSlice.actions;
export default SettingsSlice;
