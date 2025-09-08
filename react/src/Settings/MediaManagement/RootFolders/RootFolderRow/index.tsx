// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDeleteRootFolderMutation, useEditRootFolderMutation } from 'Store/Api/RootFolders';

// Misc
import { icons, kinds } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import TextInput from 'Components/Form/TextInput';

// CSS
import styles from './index.module.css';
import type { InputChanged } from 'typings/Inputs';

// Types
interface RootFolderRowProps {
    id: number;
    path: string;
    freeSpace?: number;
    totalSpace?: number;
}

// IMPLEMENTATIONS

function RootFolderRow({ id, path, freeSpace = 0, totalSpace = 0 }: RootFolderRowProps) {
    const [editRootFolder] = useEditRootFolderMutation();
    const [deleteRootFolder] = useDeleteRootFolderMutation();

    const [pathChange, setPathChange] = useState(path);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const onEditPress = useCallback(() => {
        if (isEditing) {
            if (path !== pathChange) {
                editRootFolder({ id, folder: pathChange });
            }
            setIsEditing(false);
        }
        else {
            setIsEditing(true);
        }
    }, [editRootFolder, id, isEditing, path, pathChange]);

    const handlePathChange = useCallback(({ value }: InputChanged<'path', string>) => {
        setPathChange(value);
    }, []);

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
                {isEditing ? (
                    <TextInput name="path" value={pathChange} onChange={handlePathChange} />
                ) : (
                    path
                )}
            </TableRowCell>

            <TableRowCell className={styles.freeSpace}>
                {isNaN(Number(freeSpace)) ? '-' : formatBytes(freeSpace)}
            </TableRowCell>

            <TableRowCell className={styles.freeSpace}>
                {isNaN(Number(totalSpace)) ? '-' : formatBytes(totalSpace)}
            </TableRowCell>

            <TableRowCell className={styles.actions}>
                <IconButton
                    title={translate('EditRootFolder')}
                    name={icons.EDIT}
                    onPress={onEditPress}
                />

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
