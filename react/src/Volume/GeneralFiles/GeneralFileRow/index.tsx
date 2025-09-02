// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { icons, kinds } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

import useModalOpenState from 'Helpers/Hooks/useModalOpenState';

// General Components
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { GeneralFilesColumnName } from '../GeneralFilesModalContent';

interface GeneralFileRowProps {
    id: number;
    fileType: string;
    path: string;
    size: number;
    columns: Column<GeneralFilesColumnName>[];
    onDeleteGeneralFile(): void;
}

// IMPLEMENTATIONS

export default function GeneralFileRow({
    fileType,
    path,
    size,
    columns,
    onDeleteGeneralFile,
}: GeneralFileRowProps) {
    const [
        isRemoveGeneralFileModalOpen,
        setRemoveGeneralFileModalOpen,
        setRemoveGeneralFileModalClosed,
    ] = useModalOpenState(false);

    const handleRemoveGeneralFilePress = useCallback(() => {
        onDeleteGeneralFile();

        setRemoveGeneralFileModalClosed();
    }, [onDeleteGeneralFile, setRemoveGeneralFileModalClosed]);

    return (
        <TableRow>
            {columns.map(({ name, isVisible }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'path') {
                    return <TableRowCell key={name}>{path}</TableRowCell>;
                }

                if (name === 'fileType') {
                    return <TableRowCell key={name}>{fileType}</TableRowCell>;
                }

                if (name === 'filesize') {
                    return <TableRowCell key={name}>{formatBytes(size)}</TableRowCell>;
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles.actions}>
                            <IconButton
                                title={translate('DeleteGeneralFileFromDisk')}
                                name={icons.REMOVE}
                                onPress={setRemoveGeneralFileModalOpen}
                            />
                        </TableRowCell>
                    );
                }

                return null;
            })}

            <ConfirmModal
                isOpen={isRemoveGeneralFileModalOpen}
                kind={kinds.DANGER}
                title={translate('DeleteGeneralFile')}
                message={translate('DeleteGeneralFileMessage', { path: path ?? '' })}
                confirmLabel={translate('Delete')}
                onConfirm={handleRemoveGeneralFilePress}
                onCancel={setRemoveGeneralFileModalClosed}
            />
        </TableRow>
    );
}
