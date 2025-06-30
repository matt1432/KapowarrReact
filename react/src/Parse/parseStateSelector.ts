import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import { type ParseAppState } from 'App/State/ParseAppState';

export default function parseStateSelector() {
    return createSelector(
        (state: AppState) => state.parse,
        (parse: ParseAppState) => {
            return parse;
        },
    );
}
