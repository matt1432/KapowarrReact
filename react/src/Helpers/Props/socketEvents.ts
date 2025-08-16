export const socketEvents = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    TASK_ADDED: 'task_added',
    TASK_ENDED: 'task_ended',
    TASK_STATUS: 'task_status',
    QUEUE_ADDED: 'queue_added',
    QUEUE_ENDED: 'queue_ended',
    QUEUE_STATUS: 'queue_status',
    MASS_EDITOR_STATUS: 'mass_editor_status',
    DOWNLOADED_STATUS: 'downloaded_status',
} as const;

export default socketEvents;

export type SocketEvent = (typeof socketEvents)[keyof typeof socketEvents];
