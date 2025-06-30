import { maxBy } from 'lodash';
import { createSelector } from 'reselect';
import { type Command } from 'Commands/Command';
import { REFRESH_COMICS, COMICS_SEARCH } from 'Commands/commandNames';
import { type Comics } from 'Comics/Comics';
import createExecutingCommandsSelector from 'Store/Selectors/createExecutingCommandsSelector';
import createComicsQualityProfileSelector from 'Store/Selectors/createComicsQualityProfileSelector';
import { createComicsSelectorForHook } from 'Store/Selectors/createComicsSelector';

function createComicsIndexItemSelector(comicsId: number) {
    return createSelector(
        createComicsSelectorForHook(comicsId),
        createComicsQualityProfileSelector(comicsId),
        createExecutingCommandsSelector(),
        (comics: Comics, qualityProfile, executingCommands: Command[]) => {
            const isRefreshingComics = executingCommands.some((command) => {
                return (
                    command.name === REFRESH_COMICS && command.body.comicsIds?.includes(comics.id)
                );
            });

            const isSearchingComics = executingCommands.some((command) => {
                return command.name === COMICS_SEARCH && command.body.comicsId === comicsId;
            });

            const latestSeason = maxBy(comics.seasons, (season) => season.seasonNumber);

            return {
                comics,
                qualityProfile,
                latestSeason,
                isRefreshingComics,
                isSearchingComics,
            };
        },
    );
}

export default createComicsIndexItemSelector;
