// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AuthState {
    apiKey: string | null;
    lastLogin: number;
}

// IMPLEMENTATIONS

const initialState = {
    apiKey: null,
    lastLogin: 0,
} satisfies AuthState as AuthState;

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setApiKey(state, { payload: value }: PayloadAction<string | null>) {
            state.apiKey = value;
            if (value) {
                window.Kapowarr.apiKey = value;
            }
        },
        setLastLogin(state, { payload: value }: PayloadAction<number>) {
            state.lastLogin = value;
        },
    },
});

export const { setApiKey, setLastLogin } = authSlice.actions;
export default authSlice;
