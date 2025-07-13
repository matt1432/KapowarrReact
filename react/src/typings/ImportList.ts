// import type { MonitorNewItems, VolumeMonitor, VolumeType } from 'Volume/Volume';
import { type Provider } from './Provider';

export interface ImportList extends Provider {
    enable: boolean;
    enableAutomaticAdd: boolean;
    searchForMissingIssues: boolean;
    qualityProfileId: number;
    rootFolderPath: string;
    // @ts-expect-error TODO
    shouldMonitor: VolumeMonitor;
    // @ts-expect-error TODO
    monitorNewItems: MonitorNewItems;
    // @ts-expect-error TODO
    volumeType: VolumeType;
    seasonFolder: boolean;
    listType: string;
    listOrder: number;
    minRefreshInterval: string;
    name: string;
    tags: number[];
}
