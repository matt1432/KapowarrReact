// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useDeleteVolumeMutation, useGetVolumesQuery } from 'Store/Api/Volumes';

import useVolume from 'Volume/useVolume';

// Misc
import { useNavigate } from 'react-router';

import { icons, inputTypes, kinds } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/inputs';

// IMPLEMENTATIONS

export interface DeleteVolumeModalContentProps {
    volumeId: number;
    onModalClose: () => void;
}

function DeleteVolumeModalContent({ volumeId, onModalClose }: DeleteVolumeModalContentProps) {
    const navigate = useNavigate();

    const { volume } = useVolume(volumeId);
    const { title, issueFileCount, totalSize: sizeOnDisk, folder: path } = volume!;
    const { refetch } = useGetVolumesQuery(undefined);

    const [deleteVolume] = useDeleteVolumeMutation();

    const [deleteFiles, setDeleteFiles] = useState(false);

    const handleDeleteFilesChange = useCallback(({ value }: CheckInputChanged) => {
        setDeleteFiles(value);
    }, []);

    const handleDeleteVolumeConfirmed = useCallback(() => {
        deleteVolume({ volumeId, deleteFolder: deleteFiles }).then(() => {
            refetch();

            onModalClose();
            navigate('/');
        });
    }, [volumeId, deleteFiles, deleteVolume, navigate, onModalClose, refetch]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('DeleteVolumeModalHeader', { title })}</ModalHeader>

            <ModalBody>
                <div className={styles.pathContainer}>
                    <Icon className={styles.pathIcon} name={icons.FOLDER} />

                    {path}
                </div>

                <FormGroup>
                    <FormLabel>
                        {issueFileCount === 0
                            ? translate('DeleteVolumeFolder')
                            : translate('DeleteIssuesFiles', { issueFileCount })}
                    </FormLabel>

                    <FormInputGroup
                        type={inputTypes.CHECK}
                        name="deleteFiles"
                        value={deleteFiles}
                        helpText={
                            issueFileCount === 0
                                ? translate('DeleteVolumeFolderHelpText')
                                : translate('DeleteIssuesFilesHelpText')
                        }
                        kind={kinds.DANGER}
                        onChange={handleDeleteFilesChange}
                    />
                </FormGroup>

                {deleteFiles ? (
                    <div className={styles.deleteFilesMessage}>
                        <div>
                            <InlineMarkdown
                                data={translate('DeleteVolumeFolderConfirmation', { path })}
                                blockClassName={styles.folderPath}
                            />
                        </div>

                        {issueFileCount ? (
                            <div className={styles.deleteCount}>
                                {translate('DeleteVolumeFolderIssueCount', {
                                    issueFileCount,
                                    size: formatBytes(sizeOnDisk),
                                })}
                            </div>
                        ) : null}
                    </div>
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Close')}</Button>

                <Button kind={kinds.DANGER} onPress={handleDeleteVolumeConfirmed}>
                    {translate('Delete')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default DeleteVolumeModalContent;
