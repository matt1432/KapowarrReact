import { createPersist } from 'Helpers/createPersist';
// import type { VolumeMonitor, VolumeType } from 'Volume/Volume';

export interface AddVolumeOptions {
    rootFolderPath: string;
    monitor: string; // VolumeMonitor;
    qualityProfileId: number;
    volumeType: string; // VolumeType;
    seasonFolder: boolean;
    searchForMissingIssues: boolean;
    searchForCutoffUnmetIssues: boolean;
    tags: number[];
}

const addVolumeOptionsStore = createPersist<AddVolumeOptions>('add_volume_options', () => {
    return {
        rootFolderPath: '',
        monitor: 'all',
        qualityProfileId: 0,
        volumeType: 'standard',
        seasonFolder: true,
        searchForMissingIssues: false,
        searchForCutoffUnmetIssues: false,
        tags: [],
    };
});

export const useAddVolumeOptions = () => {
    return addVolumeOptionsStore((state) => state);
};

export const useAddVolumeOption = <K extends keyof AddVolumeOptions>(key: K) => {
    return addVolumeOptionsStore((state) => state[key]);
};

export const setAddVolumeOption = <K extends keyof AddVolumeOptions>(
    key: K,
    value: AddVolumeOptions[K],
) => {
    addVolumeOptionsStore.setState((state) => ({
        ...state,
        [key]: value,
    }));
};
