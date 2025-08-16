import type { DownloadItem, DownloadState } from 'typings/Queue';
import type { MassEditAction } from './massEditActions';

export type SocketEventName =
    | 'connect'
    | 'disconnect'
    | 'task_added'
    | 'task_ended'
    | 'task_status'
    | 'queue_added'
    | 'queue_ended'
    | 'queue_status'
    | 'mass_editor_status'
    | 'downloaded_status';

const CONNECT: SocketEventName = 'connect';
const DISCONNECT: SocketEventName = 'disconnect';
const TASK_ADDED: SocketEventName = 'task_added';
const TASK_ENDED: SocketEventName = 'task_ended';
const TASK_STATUS: SocketEventName = 'task_status';
const QUEUE_ADDED: SocketEventName = 'queue_added';
const QUEUE_ENDED: SocketEventName = 'queue_ended';
const QUEUE_STATUS: SocketEventName = 'queue_status';
const MASS_EDITOR_STATUS: SocketEventName = 'mass_editor_status';
const DOWNLOADED_STATUS: SocketEventName = 'downloaded_status';

export const socketEvents = {
    CONNECT,
    DISCONNECT,
    TASK_ADDED,
    TASK_ENDED,
    TASK_STATUS,
    QUEUE_ADDED,
    QUEUE_ENDED,
    QUEUE_STATUS,
    MASS_EDITOR_STATUS,
    DOWNLOADED_STATUS,
};

export default socketEvents;

interface TaskData {
    action: string;
    volume_id: number | null;
    issue_id: number | null;
}

interface QueueStatusData {
    id: number;
    status: DownloadState;
    size: number;
    speed: number;
    progress: number;
}

interface MassEditorData {
    identifier: MassEditAction;
    current_item: number;
    total_items: number;
}

interface DownloadedStatusData {
    volume_id: number;
    not_downloaded_issues: number[];
    downloaded_issues: number[];
}

interface SpecificEventHandlers {
    task_added: (data: TaskData) => void;
    task_ended: (data: TaskData) => void;
    task_status: (data: { message: string }) => void;

    // FIXME: ensure this is the correct type
    queue_added: (data: DownloadItem) => void;

    queue_ended: (data: { id: number }) => void;
    queue_status: (data: QueueStatusData) => void;
    mass_editor_status: (data: MassEditorData) => void;
    downloaded_status: (data: DownloadedStatusData) => void;
}

export type SocketEventHandler<T extends SocketEventName> = T extends keyof SpecificEventHandlers
    ? SpecificEventHandlers[T]
    : () => void;
