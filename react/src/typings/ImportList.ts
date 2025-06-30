import type { MonitorNewItems, VolumesMonitor, VolumesType } from 'Volumes/Volumes';
import { type Provider } from './Provider';

export interface ImportList extends Provider {
    enable: boolean;
    enableAutomaticAdd: boolean;
    searchForMissingIssues: boolean;
    qualityProfileId: number;
    rootFolderPath: string;
    shouldMonitor: VolumesMonitor;
    monitorNewItems: MonitorNewItems;
    volumesType: VolumesType;
    seasonFolder: boolean;
    listType: string;
    listOrder: number;
    minRefreshInterval: string;
    name: string;
    tags: number[];
}
