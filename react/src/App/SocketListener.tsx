// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch } from 'Store/createAppStore';

import { setIsConnected, setMassEditorState } from 'Store/Slices/SocketEvents';

// Misc
import { socketEvents } from 'Helpers/Props';

import useSocketEvents from 'Helpers/Hooks/useSocketEvents';

// Types

import type { SocketEventHandler } from 'typings/Socket';

// IMPLEMENTATIONS

export default function SocketListener() {
    const dispatch = useRootDispatch();

    const handleConnect = useCallback(() => {
        dispatch(setIsConnected(true));
    }, [dispatch]);

    const handleDisconnect = useCallback(() => {
        dispatch(setIsConnected(false));
    }, [dispatch]);

    const handleMassEditorStatus = useCallback<
        SocketEventHandler<typeof socketEvents.MASS_EDITOR_STATUS>
    >(
        ({ identifier, currentItem, totalItems }) => {
            dispatch(
                setMassEditorState(identifier, {
                    // +1 because I want the item currently worked on,
                    // not the item that was just finished
                    currentItem: currentItem + 1,
                    totalItems,
                    isRunning: currentItem !== totalItems,
                }),
            );
        },
        [dispatch],
    );

    useSocketEvents({
        connect: handleConnect,
        disconnect: handleDisconnect,
        massEditorStatus: handleMassEditorStatus,
    });

    return null;
}
