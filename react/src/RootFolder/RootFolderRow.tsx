// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDispatch } from 'react-redux';
// import { deleteRootFolder } from 'Store/Actions/rootFolderActions';

// Misc
import { icons, kinds } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import ConfirmModal from 'Components/Modal/ConfirmModal';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';

// CSS
import styles from './RootFolderRow.module.css';

// Types
interface RootFolderRowProps {
    id: number;
    path: string;
    accessible: boolean;
    freeSpace?: number;
    unmappedFolders: object[];
}

// IMPLEMENTATIONS

function RootFolderRow(props: RootFolderRowProps) {
    const { id, path, accessible, freeSpace = 0, unmappedFolders = [] } = props;

    const isUnavailable = !accessible;

    const dispatch = useDispatch();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const onDeletePress = useCallback(() => {
        setIsDeleteModalOpen(true);
    }, [setIsDeleteModalOpen]);

    const onDeleteModalClose = useCallback(() => {
        setIsDeleteModalOpen(false);
    }, [setIsDeleteModalOpen]);

    const onConfirmDelete = useCallback(() => {
        // dispatch(deleteRootFolder({ id }));

        setIsDeleteModalOpen(false);
    }, [dispatch, id]);

    return (
        <TableRow>
            <TableRowCell>
                {isUnavailable ? (
                    <div className={styles.unavailablePath}>
                        {path}

                        <Label className={styles.unavailableLabel} kind={kinds.DANGER}>
                            {translate('Unavailable')}
                        </Label>
                    </div>
                ) : (
                    <Link className={styles.link} to={`/add/import/${id}`}>
                        {path}
                    </Link>
                )}
            </TableRowCell>

            <TableRowCell className={styles.freeSpace}>
                {isUnavailable || isNaN(Number(freeSpace)) ? '-' : formatBytes(freeSpace)}
            </TableRowCell>

            <TableRowCell className={styles.unmappedFolders}>
                {isUnavailable ? '-' : unmappedFolders.length}
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
