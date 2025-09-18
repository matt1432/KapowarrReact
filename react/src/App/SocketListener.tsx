// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch } from 'Store/createAppStore';

import { setIsConnected, setMassEditorState } from 'Store/Slices/SocketEvents';
import { showMessage } from 'Store/Slices/Messages';

import { useGetQueueQuery } from 'Store/Api/Queue';

// Misc
import { icons, massEditActions, socketEvents } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useSocketEvents from 'Helpers/Hooks/useSocketEvents';

// Types
import type { SocketEventHandler } from 'typings/Socket';
import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { IconName } from 'Components/Icon';

// IMPLEMENTATIONS

const ACTION_MAP = {
    [massEditActions.DELETE]: { id: 50, name: icons.DELETE },
    [massEditActions.RENAME]: { id: 51, name: icons.ORGANIZE },
    [massEditActions.SEARCH]: { id: 52, name: icons.SEARCH },
    [massEditActions.UPDATE]: { id: 53, name: icons.UPDATE },
    [massEditActions.CONVERT]: { id: 54, name: icons.CONVERT },
    [massEditActions.MONITOR]: { id: 55, name: icons.MONITORED },
    [massEditActions.UNMONITOR]: { id: 56, name: icons.UNMONITORED },
    [massEditActions.REMOVE_ADS]: { id: 57, name: icons.EDIT },
    [massEditActions.ROOT_FOLDER]: { id: 58, name: icons.ROOT_FOLDER },
    [massEditActions.MONITORING_SCHEME]: { id: 58, name: icons.MONITORED },
} satisfies Record<MassEditAction, { name: IconName; id: number }>;

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
                    currentItem: currentItem,
                    totalItems,
                    isRunning: currentItem !== totalItems,
                }),
            );

            dispatch(
                showMessage({
                    ...ACTION_MAP[identifier],
                    type: currentItem !== totalItems ? 'info' : 'success',
                    // Keep messages in progress opened
                    hideAfter: currentItem !== totalItems ? 0 : 3,
                    message: `${translate(identifier)}: ${currentItem} / ${totalItems}`,
                }),
            );
        },
        [dispatch],
    );

    const { refetch: refetchQueue } = useGetQueueQuery(undefined, {
        selectFromResult: () => ({}),
    });

    const handleQueueUpdate = useCallback(() => {
        refetchQueue();
    }, [refetchQueue]);

    useSocketEvents({
        connect: handleConnect,
        disconnect: handleDisconnect,
        massEditorStatus: handleMassEditorStatus,
        queueAdded: handleQueueUpdate,
        queueEnded: handleQueueUpdate,
        queueStatus: handleQueueUpdate,
    });

    return null;
}
