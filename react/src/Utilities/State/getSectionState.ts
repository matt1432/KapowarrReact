import _ from 'lodash';

import { type AppState } from 'App/State/AppState';

function getSectionState(state: AppState, section: string, isFullStateTree = false) {
    if (isFullStateTree) {
        return _.get(state, section);
    }

    const [, subSection] = section.split('.') as [unknown, keyof AppState];

    if (subSection) {
        return Object.assign({}, state[subSection]);
    }

    // TODO: Remove in favour of using subSection
    if (Object.prototype.hasOwnProperty.call(state, section)) {
        return Object.assign({}, state[section as keyof AppState]);
    }

    return Object.assign({}, state);
}

export default getSectionState;
