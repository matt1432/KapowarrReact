import type { CamelCasedPropertiesDeep } from 'type-fest';

import type { QueueItem } from 'typings/Queue';

import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { DownloadState } from 'Helpers/Props/downloadStates';
import type { RawTask } from './Task';
import type { VolumePublicInfo } from 'Volume/Volume';
import type { Issue } from 'Issue/Issue';

type TaskData = CamelCasedPropertiesDeep<
    Pick<RawTask, 'action' | 'volume_id' | 'issue_id' | 'called_from'>
>;

type TaskStatusData = CamelCasedPropertiesDeep<{
    message: string;
}>;

type QueueStatusData = CamelCasedPropertiesDeep<{
    id: number;
    status: DownloadState;
    size: number;
    speed: number;
    progress: number;
}>;

type QueueEndedData = CamelCasedPropertiesDeep<{
    id: number;
}>;

type MassEditorData = CamelCasedPropertiesDeep<{
    identifier: MassEditAction;
    current_item: number;
    total_items: number;
}>;

type IssuePayload = CamelCasedPropertiesDeep<{
    called_from: string;
    issue: Issue;
}>;

type VolumePayload = CamelCasedPropertiesDeep<{
    called_from: string;
    volume: VolumePublicInfo;
}>;

type DownloadedStatusData = CamelCasedPropertiesDeep<{
    volume_id: number;
    not_downloaded_issues: number[];
    downloaded_issues: number[];
}>;

interface SpecificEventHandlers {
    task_added: (data: TaskData) => void;
    task_ended: (data: TaskData) => void;
    task_status: (data: TaskStatusData) => void;
    queue_added: (data: QueueItem) => void;
    queue_ended: (data: QueueEndedData) => void;
    queue_status: (data: QueueStatusData) => void;
    issue_updated: (data: IssuePayload) => void;
    volume_updated: (data: VolumePayload) => void;
    mass_editor_status: (data: MassEditorData) => void;
    downloaded_status: (data: DownloadedStatusData) => void;
}

export type SocketEventHandler<T extends SocketEvent> = T extends keyof SpecificEventHandlers
    ? SpecificEventHandlers[T]
    : () => void;
