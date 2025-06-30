import type { Comics, ComicsMonitor, ComicsType } from 'Comics/Comics';
import { type Error } from './AppSectionState';

export interface ImportComics {
    id: string;
    error?: Error;
    isFetching: boolean;
    isPopulated: boolean;
    isQueued: boolean;
    items: Comics[];
    monitor: ComicsMonitor;
    path: string;
    qualityProfileId: number;
    relativePath: string;
    seasonFolder: boolean;
    selectedComics?: Comics;
    comicsType: ComicsType;
    term: string;
}

export interface ImportComicsAppState {
    isLookingUpComics: false;
    isImporting: false;
    isImported: false;
    importError: Error | null;
    items: ImportComics[];
}
