import { useEffect } from 'react';

import { useRootDispatch } from 'Store/createAppStore';
import { addCallback, removeCallback } from 'Store/Slices/SocketEvents';

import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { SocketEventHandler } from 'typings/Socket';

export default function useSocketCallback<Key extends SocketEvent>(
    key: Key,
    callback: SocketEventHandler<Key>,
) {
    const dispatch = useRootDispatch();

    useEffect(() => {
        dispatch(addCallback({ key, callback }));

        return () => {
            dispatch(removeCallback({ key, callback }));
        };
    }, [callback, dispatch, key]);
}
