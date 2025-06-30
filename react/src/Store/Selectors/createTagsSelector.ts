import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type Tag } from 'App/State/TagsAppState';

function createTagsSelector(): (state: AppState) => Tag[] {
    return createSelector(
        (state: AppState) => state.tags.items,
        (tags) => {
            return tags;
        },
    );
}

export default createTagsSelector;
