// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import massEditActions from 'Helpers/Props/massEditActions';

// Types
import type { MassEditAction } from 'Helpers/Props/massEditActions';

interface MassEditState {
    currentItem: number;
    totalItems: number;
    isRunning: boolean;
}

export interface SocketEventsState {
    isConnected: boolean;
    massEditorStatus: Record<MassEditAction, MassEditState>;
}

// IMPLEMENTATIONS

const initialState = {
    isConnected: true,
    massEditorStatus: Object.fromEntries(
        Object.values(massEditActions).map((action) => [
            action,
            {
                currentItem: 0,
                totalItems: 0,
                isRunning: false,
            },
        ]),
    ) as SocketEventsState['massEditorStatus'],
} satisfies SocketEventsState as SocketEventsState;

const SocketEventsSlice = createSlice({
    name: 'socketEvents',
    initialState,
    reducers: {
        setIsConnected: (state, { payload: value }: PayloadAction<boolean>) => {
            state.isConnected = value;
        },

        setMassEditorState: (
            state,
            {
                payload: { key, value },
            }: PayloadAction<{ key: MassEditAction; value: MassEditState }>,
        ) => {
            state.massEditorStatus[key] = value;
        },
    },
});

export const setMassEditorState = (key: MassEditAction, value: MassEditState) =>
    SocketEventsSlice.actions.setMassEditorState({ key, value });

export const { setIsConnected } = SocketEventsSlice.actions;

export default SocketEventsSlice;
