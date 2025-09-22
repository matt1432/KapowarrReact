// IMPORTS

// React
import { useEffect, useRef } from 'react';

// Redux
import { useRootDispatch } from 'Store/createAppStore';
import { hideMessage } from 'Store/Slices/Messages';

import classNames from 'classnames';

// General Components
import Icon from 'Components/Icon';

// CSS
import styles from './index.module.css';

// Types
import type { IconName } from 'Components/Icon';
import type { MessageType } from 'Helpers/Props/messageTypes';

export interface Message {
    id: number;
    hideAfter: number;
    name: IconName;
    message: string;
    type: Extract<MessageType, keyof typeof styles>;
}

type MessageProps = Message;

// IMPLEMENTATIONS

export default function Message({ id, hideAfter, name, message, type }: MessageProps) {
    const dispatch = useRootDispatch();

    const dismissTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        if (hideAfter) {
            dismissTimeout.current = setTimeout(() => {
                dispatch(hideMessage({ id }));

                dismissTimeout.current = undefined;
            }, hideAfter * 1000);
        }

        return () => {
            if (dismissTimeout.current) {
                clearTimeout(dismissTimeout.current);
            }
        };
    }, [id, hideAfter, message, type, dispatch]);

    return (
        <div className={classNames(styles.message, styles[type])}>
            <div className={styles.iconContainer}>
                <Icon name={name} />
            </div>

            <div className={styles.text}>{message}</div>
        </div>
    );
}
