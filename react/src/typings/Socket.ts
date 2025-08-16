import type { DownloadItem } from 'typings/Queue';

import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { DownloadState } from 'Helpers/Props/downloadStates';

// TODO: get type from Task type once it's done
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

export type SocketEventHandler<T extends SocketEvent> = T extends keyof SpecificEventHandlers
    ? SpecificEventHandlers[T]
    : () => void;
