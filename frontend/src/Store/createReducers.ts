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

export const slices = {
    [AddVolumeSlice.reducerPath]: AddVolumeSlice,
    [AppSlice.reducerPath]: AppSlice,
    [AuthSlice.reducerPath]: AuthSlice,
    [ImportVolumeSlice.reducerPath]: ImportVolumeSlice,
    [MessagesSlice.reducerPath]: MessagesSlice,
    [SocketEventsSlice.reducerPath]: SocketEventsSlice,
    [TableOptionsSlice.reducerPath]: TableOptionsSlice,
    [UISettingsSlice.reducerPath]: UISettingsSlice,
    [VolumeIndexSlice.reducerPath]: VolumeIndexSlice,
} as const;

export type SliceName = keyof typeof slices;

export default function createReducers() {
    return rememberReducer(
        combineReducers({
            [baseApi.reducerPath]: baseApi.reducer,
            ...(Object.fromEntries(
                Object.entries(slices).map(([key, slice]) => [
                    key as SliceName,
                    slice.reducer,
                ]),
            ) as {
                [S in SliceName]: (typeof slices)[S]['reducer'];
            }),
        }),
    );
}
