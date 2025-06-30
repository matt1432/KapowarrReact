import type { MonitorNewItems, ComicsMonitor, ComicsType } from 'Comics/Comics';
import { type Provider } from './Provider';

export interface ImportList extends Provider {
    enable: boolean;
    enableAutomaticAdd: boolean;
    searchForMissingEpisodes: boolean;
    qualityProfileId: number;
    rootFolderPath: string;
    shouldMonitor: ComicsMonitor;
    monitorNewItems: MonitorNewItems;
    comicsType: ComicsType;
    seasonFolder: boolean;
    listType: string;
    listOrder: number;
    minRefreshInterval: string;
    name: string;
    tags: number[];
}
