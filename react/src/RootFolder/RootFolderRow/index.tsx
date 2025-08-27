// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDeleteRootFolderMutation } from 'Store/Api/RootFolders';

// Misc
import { icons, kinds } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import ConfirmModal from 'Components/Modal/ConfirmModal';
import IconButton from 'Components/Link/IconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// CSS
import styles from './index.module.css';

// Types
interface RootFolderRowProps {
    id: number;
    path: string;
    freeSpace?: number;
}

// IMPLEMENTATIONS

function RootFolderRow({ id, path, freeSpace = 0 }: RootFolderRowProps) {
    const [deleteRootFolder] = useDeleteRootFolderMutation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const onDeletePress = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, [setIsDeleteModalOpen]);

    const onDeleteModalClose = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, [setIsDeleteModalOpen]);

    const onConfirmDelete = useCallback(() => {
        deleteRootFolder({ id });

        setIsDeleteModalOpen(false);
    }, [deleteRootFolder, id]);

    return (
        <TableRow>
            <TableRowCell>
                <div className={styles.link}>{path}</div>
            </TableRowCell>

            <TableRowCell className={styles.freeSpace}>
                {isNaN(Number(freeSpace)) ? '-' : formatBytes(freeSpace)}
            </TableRowCell>

            <TableRowCell className={styles.actions}>
                <IconButton
                    title={translate('RemoveRootFolder')}
                    name={icons.REMOVE}
                    onPress={onDeletePress}
                />
            </TableRowCell>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                kind={kinds.DANGER}
                title={translate('RemoveRootFolder')}
                message={translate('RemoveRootFolderMessageText', { path })}
                confirmLabel={translate('Remove')}
                onConfirm={onConfirmDelete}
                onCancel={onDeleteModalClose}
            />
        </TableRow>
    );
}

export default RootFolderRow;
