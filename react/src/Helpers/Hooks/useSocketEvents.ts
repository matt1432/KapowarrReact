import { useEffect } from 'react';

import socket from 'Store/socket';

import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { SocketEventHandler } from 'typings/Socket';

export type Events = {
    [Key in SocketEvent]?: SocketEventHandler<Key>;
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
