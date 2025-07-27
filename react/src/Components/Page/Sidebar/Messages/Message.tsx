// IMPORTS

// React
import { useEffect, useMemo, useRef } from 'react';

// Redux
// import { useDispatch } from 'react-redux';
// import { hideMessage } from 'Store/Actions/appActions';

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';

// General Components
import Icon, { type IconName } from 'Components/Icon';

// CSS
import styles from './Message.module.css';

// Types
interface MessageProps {
    id: number;
    hideAfter: number;
    name: string;
    message: string;
    type: keyof typeof styles; // Extract<MessageType, keyof typeof styles>;
}

// IMPLEMENTATIONS

function Message({ id, hideAfter, name, message, type }: MessageProps) {
    // const dispatch = useDispatch();
    const dismissTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const icon: IconName = useMemo(() => {
        switch (name) {
            case 'ApplicationUpdate':
                return icons.RESTART;
            case 'Backup':
                return icons.BACKUP;
            case 'CheckHealth':
                return icons.HEALTH;
            case 'IssueSearch':
                return icons.SEARCH;
            case 'Housekeeping':
                return icons.HOUSEKEEPING;
            case 'RefreshVolume':
                return icons.REFRESH;
            case 'RssSync':
                return icons.RSS;
            case 'VolumeSearch':
                return icons.SEARCH;
            case 'UpdateSceneMapping':
                return icons.REFRESH;
            default:
                return icons.SPINNER;
        }
    }, [name]);

    useEffect(() => {
        if (hideAfter) {
            dismissTimeout.current = setTimeout(() => {
                // dispatch(hideMessage({ id }));

                dismissTimeout.current = undefined;
            }, hideAfter * 1000);
        }

        return () => {
            if (dismissTimeout.current) {
                clearTimeout(dismissTimeout.current);
            }
        };
    }, [id, hideAfter, message, type /*, dispatch*/]);

    return (
        <div className={classNames(styles.message, styles[type])}>
            <div className={styles.iconContainer}>
                <Icon name={icon} title={name} />
            </div>

            <div className={styles.text}>{message}</div>
        </div>
    );
}

export default Message;
