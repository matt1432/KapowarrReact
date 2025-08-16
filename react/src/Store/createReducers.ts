// IMPORTS

// Redux
import { combineReducers } from '@reduxjs/toolkit';
import { rememberReducer } from 'redux-remember';

// Slices
import AddVolumeSlice from './Slices/AddVolume';
import AppSlice from './Slices/App';
import AuthSlice from './Slices/Auth';
import IssueTableSlice from './Slices/IssueTable';
import SettingsSlice from './Slices/Settings';
import UISettingsSlice from './Slices/UISettings';
import VolumeIndexSlice from './Slices/VolumeIndex';

// API
import { baseApi } from './Api/base';

// IMPLEMENTATIONS

export default function createReducers() {
    return rememberReducer(
        combineReducers({
            [baseApi.reducerPath]: baseApi.reducer,

            [AddVolumeSlice.reducerPath]: AddVolumeSlice.reducer,
            [AppSlice.reducerPath]: AppSlice.reducer,
            [AuthSlice.reducerPath]: AuthSlice.reducer,
            [IssueTableSlice.reducerPath]: IssueTableSlice.reducer,
            [SettingsSlice.reducerPath]: SettingsSlice.reducer,
            [UISettingsSlice.reducerPath]: UISettingsSlice.reducer,
            [VolumeIndexSlice.reducerPath]: VolumeIndexSlice.reducer,
        }),
    );
}
