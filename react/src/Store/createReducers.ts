// IMPORTS

// Redux
import { combineReducers } from '@reduxjs/toolkit';
import { rememberReducer } from 'redux-remember';

// Slices
import AddVolumeSlice from './Slices/AddVolume';
import AppSlice from './Slices/App';
import AuthSlice from './Slices/Auth';
import IssueTableSlice from './Slices/IssueTable';
import MessagesSlice from './Slices/Messages';
import QueueTableSlice from './Slices/QueueTable';
import SearchResultsSlice from './Slices/SearchResults';
import SettingsSlice from './Slices/Settings';
import SocketEventsSlice from './Slices/SocketEvents';
import UISettingsSlice from './Slices/UISettings';
import VolumeIndexSlice from './Slices/VolumeIndex';

// API
import { baseApi } from './Api/base';
import ImportVolumeSlice from './Slices/ImportVolume';

// IMPLEMENTATIONS

export default function createReducers() {
    return rememberReducer(
        combineReducers({
            [baseApi.reducerPath]: baseApi.reducer,

            [AddVolumeSlice.reducerPath]: AddVolumeSlice.reducer,
            [AppSlice.reducerPath]: AppSlice.reducer,
            [AuthSlice.reducerPath]: AuthSlice.reducer,
            [ImportVolumeSlice.reducerPath]: ImportVolumeSlice.reducer,
            [IssueTableSlice.reducerPath]: IssueTableSlice.reducer,
            [MessagesSlice.reducerPath]: MessagesSlice.reducer,
            [QueueTableSlice.reducerPath]: QueueTableSlice.reducer,
            [SearchResultsSlice.reducerPath]: SearchResultsSlice.reducer,
            [SettingsSlice.reducerPath]: SettingsSlice.reducer,
            [SocketEventsSlice.reducerPath]: SocketEventsSlice.reducer,
            [UISettingsSlice.reducerPath]: UISettingsSlice.reducer,
            [VolumeIndexSlice.reducerPath]: VolumeIndexSlice.reducer,
        }),
    );
}
