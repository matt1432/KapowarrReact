// IMPORTS

// React
import { useCallback } from 'react';

// Redux

// Misc
import { icons, kinds, tooltipPositions } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

import useModalOpenState from 'Helpers/Hooks/useModalOpenState';

// General Components
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import Popover from 'Components/Tooltip/Popover';

// Specific Components
import MediaInfo from '../MediaInfo';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { IssueSummaryColumnName } from 'Issue/Issue';

interface IssueFileRowProps {
    path: string | undefined;
    size: number | undefined;
    releaser: string | undefined;
    scanType: string | undefined;
    resolution: string | undefined;
    dpi: string | undefined;
    columns: Column<IssueSummaryColumnName>[];
    onDeleteIssueFile(): void;
}

// IMPLEMENTATIONS

export default function IssueFileRow({
    path,
    size = 0,
    columns,
    onDeleteIssueFile,
    ...mediaInfo
}: IssueFileRowProps) {
    const [isRemoveIssueFileModalOpen, setRemoveIssueFileModalOpen, setRemoveIssueFileModalClosed] =
        useModalOpenState(false);

    const handleRemoveIssueFilePress = useCallback(() => {
        onDeleteIssueFile();

        setRemoveIssueFileModalClosed();
    }, [onDeleteIssueFile, setRemoveIssueFileModalClosed]);

    return (
        <TableRow>
            {columns.map(({ name, isVisible }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'path') {
                    return <TableRowCell key={name}>{path}</TableRowCell>;
                }

                if (name === 'filesize') {
                    return <TableRowCell key={name}>{formatBytes(size)}</TableRowCell>;
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles.actions}>
                            {Object.values(mediaInfo).some((i) => i !== undefined) ? (
                                <Popover
                                    anchor={<Icon name={icons.MEDIA_INFO} />}
                                    title={translate('MediaInfo')}
                                    body={<MediaInfo {...mediaInfo} />}
                                    position={tooltipPositions.LEFT}
                                />
                            ) : null}

                            <IconButton
                                title={translate('DeleteIssueFromDisk')}
                                name={icons.REMOVE}
                                onPress={setRemoveIssueFileModalOpen}
                            />
                        </TableRowCell>
                    );
                }

                return null;
            })}

            <ConfirmModal
                isOpen={isRemoveIssueFileModalOpen}
                kind={kinds.DANGER}
                title={translate('DeleteIssueFile')}
                message={translate('DeleteIssueFileMessage', { path: path ?? '' })}
                confirmLabel={translate('Delete')}
                onConfirm={handleRemoveIssueFilePress}
                onCancel={setRemoveIssueFileModalClosed}
            />
        </TableRow>
    );
}
