export type MessageType = 'error' | 'info' | 'success' | 'warning';

const ERROR: MessageType = 'error';
const INFO: MessageType = 'info';
const SUCCESS: MessageType = 'success';
const WARNING: MessageType = 'warning';

const all: MessageType[] = [ERROR, INFO, SUCCESS, WARNING];

export const messageTypes = {
    ERROR,
    INFO,
    SUCCESS,
    WARNING,
    all,
};

export default messageTypes;
