import { useEffect } from 'react';

import { slices } from './createReducers';
import { useRootSelector } from './createAppStore';

export default function BreakingChangeHandler() {
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
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }

        // Run this only once at start
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}
