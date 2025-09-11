import type { CamelCasedPropertiesDeep } from 'type-fest';

import type { QueueItem } from 'typings/Queue';

import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { DownloadState } from 'Helpers/Props/downloadStates';
import type { RawTask } from './Task';

type TaskData = Pick<RawTask, 'action' | 'volume_id' | 'issue_id'>;

interface TaskStatusData {
    message: string;
}

interface QueueStatusData {
    id: number;
    status: DownloadState;
    size: number;
    speed: number;
    progress: number;
}

interface QueueEndedData {
    id: number;
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
    task_added: (data: CamelCasedPropertiesDeep<TaskData>) => void;
    task_ended: (data: CamelCasedPropertiesDeep<TaskData>) => void;
    task_status: (data: CamelCasedPropertiesDeep<TaskStatusData>) => void;
    queue_added: (data: CamelCasedPropertiesDeep<QueueItem>) => void;
    queue_ended: (data: CamelCasedPropertiesDeep<QueueEndedData>) => void;
    queue_status: (data: CamelCasedPropertiesDeep<QueueStatusData>) => void;
    mass_editor_status: (data: CamelCasedPropertiesDeep<MassEditorData>) => void;
    downloaded_status: (data: CamelCasedPropertiesDeep<DownloadedStatusData>) => void;
}

export type SocketEventHandler<T extends SocketEvent> = T extends keyof SpecificEventHandlers
    ? SpecificEventHandlers[T]
    : () => void;
