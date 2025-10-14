import { useEffect } from 'react';

import { useRootDispatch, useRootSelector } from './createAppStore';
import { setIsHandlingBreakingChange } from './Slices/App';

import { slices } from './createReducers';

export default function BreakingChangeHandler() {
    const dispatch = useRootDispatch();

    const state = useRootSelector((state) => state);

    useEffect(() => {
        let hadChanges = false;

        Object.entries(slices).forEach(([name, slice]) => {
            const sliceName = name as keyof typeof slices;

            const initialState = slice.getInitialState();
            const currentState = state[sliceName];

            if ('sliceVersion' in initialState) {
                if (
                    !('sliceVersion' in currentState) ||
                    currentState.sliceVersion < initialState.sliceVersion
                ) {
                    hadChanges = true;
                    localStorage.removeItem(`kapowarr_${sliceName}`);
                }
            }
        });

        if (hadChanges) {
            dispatch(setIsHandlingBreakingChange(true));
        }

        if (state.app.isHandlingBreakingChange) {
            window.location.reload();
        }
    }, [dispatch, state]);

    return null;
}
