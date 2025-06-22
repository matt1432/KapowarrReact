import { type ModelBase } from 'App/ModelBase';
import { type AppSectionState } from 'App/State/AppSectionState';

export type MessageType = 'error' | 'info' | 'success' | 'warning';

export interface Message extends ModelBase {
    hideAfter: number;
    message: string;
    name: string;
    type: MessageType;
}

export type MessagesAppState = AppSectionState<Message>;
