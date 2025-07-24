import { createPersist } from 'Helpers/createPersist';

import type { RootFolder } from 'typings/RootFolder';
import type { MonitoringScheme, SpecialVersion } from 'Volume/Volume';

export interface AddVolumeOptions {
    rootFolder: RootFolder | null;
    monitor: boolean;
    monitoringScheme: MonitoringScheme;
    specialVersion: SpecialVersion;
}

const addVolumeOptionsStore = createPersist<AddVolumeOptions>('add_volume_options', () => {
    return {
        rootFolder: null,
        monitor: true,
        monitoringScheme: 'all',
        specialVersion: '' as SpecialVersion,
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
