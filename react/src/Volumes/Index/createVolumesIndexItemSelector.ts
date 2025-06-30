import { maxBy } from 'lodash';
import { createSelector } from 'reselect';
import { type Command } from 'Commands/Command';
import { REFRESH_VOLUMES, VOLUMES_SEARCH } from 'Commands/commandNames';
import { type Volumes } from 'Volumes/Volumes';
import createExecutingCommandsSelector from 'Store/Selectors/createExecutingCommandsSelector';
import createVolumesQualityProfileSelector from 'Store/Selectors/createVolumesQualityProfileSelector';
import { createVolumesSelectorForHook } from 'Store/Selectors/createVolumesSelector';

function createVolumesIndexItemSelector(volumesId: number) {
    return createSelector(
        createVolumesSelectorForHook(volumesId),
        createVolumesQualityProfileSelector(volumesId),
        createExecutingCommandsSelector(),
        (volumes: Volumes, qualityProfile, executingCommands: Command[]) => {
            const isRefreshingVolumes = executingCommands.some((command) => {
                return (
                    command.name === REFRESH_VOLUMES && command.body.volumesIds?.includes(volumes.id)
                );
            });

            const isSearchingVolumes = executingCommands.some((command) => {
                return command.name === VOLUMES_SEARCH && command.body.volumesId === volumesId;
            });

            const latestSeason = maxBy(volumes.seasons, (season) => season.seasonNumber);

            return {
                volumes,
                qualityProfile,
                latestSeason,
                isRefreshingVolumes,
                isSearchingVolumes,
            };
        },
    );
}

export default createVolumesIndexItemSelector;
