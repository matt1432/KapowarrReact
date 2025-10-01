// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface UISettingsState {
    sliceVersion: number;

    theme: 'auto' | 'dark' | 'light';
    enableColorImpairedMode: boolean;
    showRelativeDates: boolean;
    shortDateFormat: string;
    longDateFormat: string;
    timeFormat: string;
}

// IMPLEMENTATIONS

const initialState = {
    sliceVersion: 0,

    theme: 'auto',
    enableColorImpairedMode: false,
    showRelativeDates: true,
    shortDateFormat: 'MMM D YYYY',
    longDateFormat: 'dddd, MMMM D YYYY',
    timeFormat: 'h(:mm)a',
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
