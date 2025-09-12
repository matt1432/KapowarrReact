// IMPORTS

// React
import { useMemo } from 'react';

// Misc
import { downloadStates, icons, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Icon from 'Components/Icon';
import Popover from 'Components/Tooltip/Popover';

// Types
import type { DownloadState } from 'Helpers/Props/downloadStates';
import type { TooltipPosition } from 'Helpers/Props/tooltipPositions';

interface QueueStatusProps {
    sourceTitle: string;
    status: DownloadState;
    position: TooltipPosition;
    canFlip?: boolean;
}

// IMPLEMENTATIONS

function QueueStatus({ sourceTitle, status, position, canFlip = false }: QueueStatusProps) {
    const {
        iconName,
        iconKind = kinds.DEFAULT_KIND,
        title,
    } = useMemo(() => {
        switch (status) {
            case downloadStates.DOWNLOADING: {
                return {
                    iconName: icons.DOWNLOADING,
                    title: translate('Downloading'),
                };
            }
            case downloadStates.PAUSED: {
                return {
                    iconName: icons.PAUSED,
                    title: translate('Paused'),
                };
            }
            case downloadStates.QUEUED: {
                return {
                    iconName: icons.QUEUED,
                    title: translate('Queued'),
                };
            }
            case downloadStates.IMPORTING: {
                return {
                    iconName: icons.DOWNLOADED,
                    title: translate('Importing'),
                    iconKind: kinds.PURPLE,
                };
            }
            case downloadStates.FAILED: {
                return {
                    iconName: icons.DOWNLOADING,
                    iconKind: kinds.DANGER,
                    title: translate('DownloadFailed'),
                };
            }
            case downloadStates.SHUTDOWN: {
                return {
                    iconName: icons.SHUTDOWN,
                    iconKind: kinds.DANGER,
                    title: translate('Shutdown'),
                };
            }
            case downloadStates.CANCELED: {
                return {
                    iconName: icons.BLOCK,
                    iconKind: kinds.DANGER,
                    title: translate('Canceled'),
                };
            }
            case downloadStates.SEEDING: {
                return {
                    iconName: icons.DOWNLOADED,
                    iconKind: kinds.PINK,
                    title: translate('Seeding'),
                };
            }
        }
    }, [status]);

    return (
        <Popover
            anchor={<Icon name={iconName} kind={iconKind} />}
            title={title}
            body={sourceTitle}
            position={position}
            canFlip={canFlip}
        />
    );
}

export default QueueStatus;
