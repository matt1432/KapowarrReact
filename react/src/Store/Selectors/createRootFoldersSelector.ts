import { createSelector } from 'reselect';
import { type RootFolderAppState } from 'App/State/RootFolderAppState';
import createSortedSectionSelector from 'Store/Selectors/createSortedSectionSelector';
import { type RootFolder } from 'typings/RootFolder';
import sortByProp from 'Utilities/Array/sortByProp';

export default function createRootFoldersSelector() {
    return createSelector(
        createSortedSectionSelector<RootFolder, RootFolderAppState>(
            'rootFolders',
            sortByProp('path'),
        ),
        (rootFolders: RootFolderAppState) => rootFolders,
    );
}
