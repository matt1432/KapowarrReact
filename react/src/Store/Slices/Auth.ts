// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AuthState {
    apiKey: string | null;
    lastLogin: number;
    formsAuth: boolean;
}

// IMPLEMENTATIONS

const initialState = {
    apiKey: null,
    lastLogin: 0,
    formsAuth: false,
} satisfies AuthState as AuthState;

const AuthSlice = createSlice({
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

        setFormsAuth(state, { payload: value }: PayloadAction<boolean>) {
            state.formsAuth = value;
        },
    },
});

export const { setApiKey, setLastLogin, setFormsAuth } = AuthSlice.actions;
export default AuthSlice;
