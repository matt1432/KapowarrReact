// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useSearchVolumeQuery } from 'Store/Api/Volumes';
import { useDeleteFileMutation } from 'Store/Api/Files';

// Misc
import translate from 'Utilities/String/translate';

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
export interface GeneralFilesModalContentProps {
    volumeId: number;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function GeneralFilesModalContent({
    volumeId,
    onModalClose,
}: GeneralFilesModalContentProps) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.generalFiles,
    );

    const { generalFiles, refetch } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data }) => ({
                generalFiles: data?.generalFiles ?? [],
            }),
        },
    );

    const [deleteFile] = useDeleteFileMutation();

    const handleDeleteGeneralFile = useCallback(
        (fileId: number) => async () => {
            const { error: deleteError } = await deleteFile({ fileId });

            if (!deleteError) {
                refetch();
            }
        },
        [deleteFile, refetch],
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
