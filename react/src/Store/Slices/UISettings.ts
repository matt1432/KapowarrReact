// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc

// Types
export interface UISettingsState {
    theme: 'auto' | 'dark' | 'light';
    enableColorImpairedMode: boolean;
}

// IMPLEMENTATIONS

const initialState = {
    theme: 'auto',
    enableColorImpairedMode: false,
} satisfies UISettingsState as UISettingsState;

const UISettingsSlice = createSlice({
    name: 'uiSettings',
    initialState,
    reducers: {
        setUISettingsOption: <K extends keyof UISettingsState>(
            state: UISettingsState,
            { payload }: PayloadAction<{ key: K; value: UISettingsState[K] }>,
        ) => {
            state[payload.key] = payload.value;
        },
    },
});

export const setUISettingsOption = <K extends keyof UISettingsState>(
    key: K,
    value: UISettingsState[K],
) => UISettingsSlice.actions.setUISettingsOption({ key, value });

export default UISettingsSlice;
