import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';

export interface ComicsQueueDetails {
    count: number;
    issuesWithFiles: number;
}

function createComicsQueueDetailsSelector(comicsId: number, seasonNumber?: number) {
    return createSelector(
        (state: AppState) => state.queue.details.items,
        (queueItems) => {
            return queueItems.reduce(
                (acc: ComicsQueueDetails, item) => {
                    if (item.trackedDownloadState === 'imported' || item.comicsId !== comicsId) {
                        return acc;
                    }

                    if (seasonNumber != null && item.seasonNumber !== seasonNumber) {
                        return acc;
                    }

                    acc.count++;

                    if (item.issueHasFile) {
                        acc.issuesWithFiles++;
                    }

                    return acc;
                },
                {
                    count: 0,
                    issuesWithFiles: 0,
                },
            );
        },
    );
}

export default createComicsQueueDetailsSelector;
