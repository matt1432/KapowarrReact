import { type DiskSpace } from 'typings/DiskSpace';
import { type Health } from 'typings/Health';
import { type LogFile } from 'typings/LogFile';
import { type SystemStatus } from 'typings/SystemStatus';
import { type Task } from 'typings/Task';
import type { AppSectionState, AppSectionItemState } from './AppSectionState';
import { type BackupAppState } from './BackupAppState';

export type DiskSpaceAppState = AppSectionState<DiskSpace>;
export type HealthAppState = AppSectionState<Health>;
export type SystemStatusAppState = AppSectionItemState<SystemStatus>;
export type TaskAppState = AppSectionState<Task>;
export type LogFilesAppState = AppSectionState<LogFile>;

export interface SystemAppState {
    backups: BackupAppState;
    diskSpace: DiskSpaceAppState;
    health: HealthAppState;
    logFiles: LogFilesAppState;
    status: SystemStatusAppState;
    tasks: TaskAppState;
    updateLogFiles: LogFilesAppState;
}
