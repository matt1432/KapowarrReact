import { useEffect } from 'react';

import socket from 'Store/socket';

export interface Event {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler(...args: any[]): void;
}

export default function useSocketEvents(events: Event[]) {
    useEffect(() => {
        for (const event of events) {
            socket.on(event.name, event.handler);
        }

        return () => {
            for (const event of events) {
                socket.off(event.name);
            }
        };
    }, [events]);
}
