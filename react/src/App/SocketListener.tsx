// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch } from 'Store/createAppStore';

import { setIsConnected, setMassEditorState } from 'Store/Slices/SocketEvents';

// Misc
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

    const handleMassEditorStatus = useCallback<SocketEventHandler<'mass_editor_status'>>(
        ({ identifier, current_item, total_items }) => {
            dispatch(
                setMassEditorState(identifier, {
                    // +1 because I want the item currently worked on, not the item that was just finished
                    currentItem: current_item + 1,
                    totalItems: total_items,
                    isRunning: current_item !== total_items,
                }),
            );
        },
        [dispatch],
    );

    useSocketEvents({
        connect: handleConnect,
        disconnect: handleDisconnect,

        mass_editor_status: handleMassEditorStatus,
    });

    return null;
}
