// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Misc
import socketEvents from 'Helpers/Props/socketEvents';
import massEditActions from 'Helpers/Props/massEditActions';

// Types
import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { SocketEventHandler } from 'typings/Socket';

interface MassEditState {
    currentItem: number;
    totalItems: number;
    isRunning: boolean;
}

interface StatusState {
    isConverting?: boolean;
    isRefreshing?: boolean;
    isRenaming?: boolean;
    isSearching?: boolean;
}

export interface SocketEventsState {
    isConnected: boolean;
    massEditorStatus: Record<MassEditAction, MassEditState>;
    callbacks: { [Key in SocketEvent]: SocketEventHandler<Key>[] };
    volumesStatus: Partial<
        Record<
            number,
            StatusState & {
                issues?: Partial<Record<number, StatusState>>;
            }
        >
    >;
    isSearchAllRunning: boolean;
    isUpdateAllRunning: boolean;
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
    callbacks: Object.fromEntries(
        Object.values(socketEvents).map((key) => [key, []]),
    ) as unknown as SocketEventsState['callbacks'],
    volumesStatus: {},
    isSearchAllRunning: false,
    isUpdateAllRunning: false,
} satisfies SocketEventsState as SocketEventsState;

const SocketEventsSlice = createSlice({
    name: 'socketEvents',
    initialState,
    reducers: {
        setIsConnected: (state, { payload: value }: PayloadAction<boolean>) => {
            state.isConnected = value;
        },

        setIsSearchAllRunning: (state, { payload: value }: PayloadAction<boolean>) => {
            state.isSearchAllRunning = value;
        },

        setIsUpdateAllRunning: (state, { payload: value }: PayloadAction<boolean>) => {
            state.isUpdateAllRunning = value;
        },

        setMassEditorState: (
            state,
            {
                payload: { key, value },
            }: PayloadAction<{ key: MassEditAction; value: MassEditState }>,
        ) => {
            state.massEditorStatus[key] = value;
        },

        addCallback: <Key extends SocketEvent>(
            state: SocketEventsState,
            {
                payload: { key, callback },
            }: PayloadAction<{ key: Key; callback: SocketEventHandler<Key> }>,
        ) => {
            state.callbacks[key].push(callback);
        },

        removeCallback: <Key extends SocketEvent>(
            state: SocketEventsState,
            {
                payload: { key, callback },
            }: PayloadAction<{ key: Key; callback: SocketEventHandler<Key> }>,
        ) => {
            state.callbacks[key].splice(state.callbacks[key].indexOf(callback), 1);
        },

        editVolumeStatus: (
            state,
            {
                payload: { volumeId, status },
            }: PayloadAction<{ volumeId: number; status: StatusState }>,
        ) => {
            state.volumesStatus[volumeId] = {
                ...(state.volumesStatus[volumeId] ?? {}),
                ...status,
            };
        },

        editIssueStatus: (
            state,
            {
                payload: { volumeId, issueId, status },
            }: PayloadAction<{ volumeId: number; issueId: number; status: StatusState }>,
        ) => {
            state.volumesStatus[volumeId] = {
                ...(state.volumesStatus[volumeId] ?? {}),
                issues: {
                    [issueId]: {
                        ...((state.volumesStatus[volumeId]?.issues ?? {})[issueId] ?? {}),
                        ...status,
                    },
                },
            };
        },
    },

    selectors: {
        getVolumeStatus: (state, volumeId) => {
            const {
                isConverting = false,
                isRefreshing = false,
                isRenaming = false,
                isSearching = false,
            } = state.volumesStatus[volumeId] ?? {};

            return {
                isConverting,
                isRefreshing,
                isRenaming,
                isSearching,
            };
        },

        getIssueStatus: (state, volumeId, issueId) => {
            const { issues = {} } = state.volumesStatus[volumeId] ?? {};
            const {
                isConverting = false,
                isRefreshing = false,
                isRenaming = false,
                isSearching = false,
            } = issues[issueId] ?? {};

            return {
                isConverting,
                isRefreshing,
                isRenaming,
                isSearching,
            };
        },
    },
});

export const setMassEditorState = (key: MassEditAction, value: MassEditState) =>
    SocketEventsSlice.actions.setMassEditorState({ key, value });

export const {
    addCallback,
    removeCallback,
    editIssueStatus,
    editVolumeStatus,
    setIsConnected,
    setIsUpdateAllRunning,
    setIsSearchAllRunning,
} = SocketEventsSlice.actions;

export const { getIssueStatus, getVolumeStatus } = SocketEventsSlice.selectors;

export default SocketEventsSlice;
