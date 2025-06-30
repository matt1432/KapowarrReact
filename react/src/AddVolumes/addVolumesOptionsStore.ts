import { createPersist } from 'Helpers/createPersist';
import type { VolumesMonitor, VolumesType } from 'Volumes/Volumes';

export interface AddVolumesOptions {
    rootFolderPath: string;
    monitor: VolumesMonitor;
    qualityProfileId: number;
    volumesType: VolumesType;
    seasonFolder: boolean;
    searchForMissingIssues: boolean;
    searchForCutoffUnmetIssues: boolean;
    tags: number[];
}

const addVolumesOptionsStore = createPersist<AddVolumesOptions>('add_volumes_options', () => {
    return {
        rootFolderPath: '',
        monitor: 'all',
        qualityProfileId: 0,
        volumesType: 'standard',
        seasonFolder: true,
        searchForMissingIssues: false,
        searchForCutoffUnmetIssues: false,
        tags: [],
    };
});

export const useAddVolumesOptions = () => {
    return addVolumesOptionsStore((state) => state);
};

export const useAddVolumesOption = <K extends keyof AddVolumesOptions>(key: K) => {
    return addVolumesOptionsStore((state) => state[key]);
};

export const setAddVolumesOption = <K extends keyof AddVolumesOptions>(
    key: K,
    value: AddVolumesOptions[K],
) => {
    addVolumesOptionsStore.setState((state) => ({
        ...state,
        [key]: value,
    }));
};
