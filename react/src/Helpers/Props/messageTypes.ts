const messageTypes = {
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
} as const;

export default messageTypes;

export type MessageType = (typeof messageTypes)[keyof typeof messageTypes];
