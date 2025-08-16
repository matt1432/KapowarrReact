import { useEffect } from 'react';

import socket from 'Store/socket';

import type { SocketEventHandler, SocketEventName } from 'Helpers/Props/socketEvents';

export type Events = {
    [Key in SocketEventName]?: SocketEventHandler<Key>;
};

export default function useSocketEvents(events: Events) {
    useEffect(() => {
        Object.entries(events).forEach(([name, handler]) => {
            socket.on(name, handler);
        });

        return () => {
            Object.entries(events).forEach(([name, handler]) => {
                socket.off(name, handler);
            });
        };
    }, [events]);
}
