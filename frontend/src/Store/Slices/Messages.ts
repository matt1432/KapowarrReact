// IMPORTS

// Redux
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
import type { Message } from 'Components/Page/Sidebar/Messages/Message';

export interface MessagesState {
    lastId: number;
    items: Message[];
}

// IMPLEMENTATIONS

const initialState = {
    lastId: 0,
    items: [],
} satisfies MessagesState as MessagesState;

const MessagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        showMessage: (state, { payload: message }: PayloadAction<Message>) => {
            state.items = state.items.filter((item) => item.id !== message.id);
            state.items.push(message);
        },

        hideMessage: (
            state,
            { payload: { id } }: PayloadAction<{ id: number }>,
        ) => {
            state.items = state.items.filter((item) => item.id !== id);
        },
    },
});

export const { hideMessage, showMessage } = MessagesSlice.actions;
export default MessagesSlice;
