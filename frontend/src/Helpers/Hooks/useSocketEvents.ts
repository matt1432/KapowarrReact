import { useEffect, useMemo } from 'react';

import socket from 'Store/socket';

import { snakeCase } from 'lodash';
import camelize from 'Utilities/Object/camelize';

import type { CamelCase, SnakeCase } from 'type-fest';
import type { SocketEvent } from 'Helpers/Props/socketEvents';
import type { SocketEventHandler } from 'typings/Socket';

export type Events = {
    [Key in CamelCase<SocketEvent>]?: SocketEventHandler<SnakeCase<Key>>;
};

export default function useSocketEvents(_events: Events) {
    const events = useMemo(
        () =>
            Object.entries(_events).map(
                ([name, handler]) =>
                    [
                        snakeCase(name),
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (data: any) => handler(camelize(data)),
                    ] as [SocketEvent, SocketEventHandler<SocketEvent>],
            ),
        [_events],
    );

    useEffect(() => {
        events.forEach(([name, handler]) => {
            socket.on(name, handler);
        });

        return () => {
            events.forEach(([name, handler]) => {
                socket.off(name, handler);
            });
        };
    }, [events]);
}
