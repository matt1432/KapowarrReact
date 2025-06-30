import { createPersist } from 'Helpers/createPersist';
import type { ComicsMonitor, ComicsType } from 'Comics/Comics';

export interface AddComicsOptions {
    rootFolderPath: string;
    monitor: ComicsMonitor;
    qualityProfileId: number;
    comicsType: ComicsType;
    seasonFolder: boolean;
    searchForMissingIssues: boolean;
    searchForCutoffUnmetIssues: boolean;
    tags: number[];
}

const addComicsOptionsStore = createPersist<AddComicsOptions>('add_comics_options', () => {
    return {
        rootFolderPath: '',
        monitor: 'all',
        qualityProfileId: 0,
        comicsType: 'standard',
        seasonFolder: true,
        searchForMissingIssues: false,
        searchForCutoffUnmetIssues: false,
        tags: [],
    };
});

export const useAddComicsOptions = () => {
    return addComicsOptionsStore((state) => state);
};

export const useAddComicsOption = <K extends keyof AddComicsOptions>(key: K) => {
    return addComicsOptionsStore((state) => state[key]);
};

export const setAddComicsOption = <K extends keyof AddComicsOptions>(
    key: K,
    value: AddComicsOptions[K],
) => {
    addComicsOptionsStore.setState((state) => ({
        ...state,
        [key]: value,
    }));
};
