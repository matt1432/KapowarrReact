// IMPORTS

// Redux
import { combineReducers } from '@reduxjs/toolkit';
import { rememberReducer } from 'redux-remember';

// Slices
import AddVolumeSlice from './Slices/AddVolume';
import AppSlice from './Slices/App';
import AuthSlice from './Slices/Auth';
import ImportVolumeSlice from './Slices/ImportVolume';
import MessagesSlice from './Slices/Messages';
import SocketEventsSlice from './Slices/SocketEvents';
import TableOptionsSlice from './Slices/TableOptions';
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
            [ImportVolumeSlice.reducerPath]: ImportVolumeSlice.reducer,
            [MessagesSlice.reducerPath]: MessagesSlice.reducer,
            [SocketEventsSlice.reducerPath]: SocketEventsSlice.reducer,
            [TableOptionsSlice.reducerPath]: TableOptionsSlice.reducer,
            [UISettingsSlice.reducerPath]: UISettingsSlice.reducer,
            [VolumeIndexSlice.reducerPath]: VolumeIndexSlice.reducer,
        }),
    );
}
