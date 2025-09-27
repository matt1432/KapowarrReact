// IMPORTS

// React
import { useCallback, useEffect } from 'react';

// Redux
import { useSearchVolumeQuery } from 'Store/Api/Volumes';
import { useDeleteFileMutation } from 'Store/Api/Files';

// Misc
import translate from 'Utilities/String/translate';

// Hooks
import usePrevious from 'Helpers/Hooks/usePrevious';

// General Components
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import GeneralFileRow from '../GeneralFileRow';

// Types
import type { Column } from 'Components/Table/Column';

export type GeneralFilesColumnName =
    | 'path'
    | 'fileType'
    | 'filesize'
    | 'actions';

export interface GeneralFilesModalContentProps {
    volumeId: number;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

const columns: Column<GeneralFilesColumnName>[] = [
    {
        name: 'path',
        isModifiable: false,
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'fileType',
        isModifiable: false,
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'filesize',
        isModifiable: false,
        isSortable: false,
        isVisible: true,
    },
    {
        name: 'actions',
        hideHeaderLabel: true,
        isModifiable: false,
        isSortable: false,
        isVisible: true,
    },
];

export default function GeneralFilesModalContent({
    volumeId,
    onModalClose,
}: GeneralFilesModalContentProps) {
    const { generalFiles = [], refetch } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                generalFiles: data?.generalFiles ?? [],
            }),
        },
    );

    const [deleteFile, { isLoading, isSuccess }] = useDeleteFileMutation();
    const wasLoading = usePrevious(isLoading);

    useEffect(() => {
        if (!isLoading && wasLoading && isSuccess) {
            refetch();
        }
    }, [isLoading, isSuccess, wasLoading, refetch]);

    const handleDeleteGeneralFile = useCallback(
        (fileId: number) => () => {
            deleteFile({ fileId });
        },
        [deleteFile],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('GeneralFilesModalHeader')}</ModalHeader>

            <ModalBody>
                {generalFiles.length !== 0 ? (
                    <Table tableName="generalFiles" columns={columns}>
                        <TableBody>
                            {generalFiles.map(
                                ({ id, fileType, filepath, size }) => (
                                    <GeneralFileRow
                                        key={id}
                                        id={id}
                                        fileType={fileType}
                                        path={filepath}
                                        size={size}
                                        columns={columns}
                                        onDeleteGeneralFile={handleDeleteGeneralFile(
                                            id,
                                        )}
                                    />
                                ),
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div>{translate('GeneralFilesNoFiles')}</div>
                )}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}
