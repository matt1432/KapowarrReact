import type { Volumes, VolumesMonitor, VolumesType } from 'Volumes/Volumes';
import { type Error } from './AppSectionState';

export interface ImportVolumes {
    id: string;
    error?: Error;
    isFetching: boolean;
    isPopulated: boolean;
    isQueued: boolean;
    items: Volumes[];
    monitor: VolumesMonitor;
    path: string;
    qualityProfileId: number;
    relativePath: string;
    seasonFolder: boolean;
    selectedVolumes?: Volumes;
    volumesType: VolumesType;
    term: string;
}

export interface ImportVolumesAppState {
    isLookingUpVolumes: false;
    isImporting: false;
    isImported: false;
    importError: Error | null;
    items: ImportVolumes[];
}
