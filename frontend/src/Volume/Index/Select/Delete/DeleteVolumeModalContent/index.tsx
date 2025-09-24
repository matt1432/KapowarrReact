// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useMassEditMutation } from 'Store/Api/Command';
import { useGetVolumesQuery } from 'Store/Api/Volumes';

// Misc
import { inputTypes, kinds, massEditActions } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/Inputs';

interface DeleteVolumeModalContentProps {
    volumeIds: number[];
    onModalClose(): void;
}

// IMPLEMENTATIONS

export default function DeleteVolumeModalContent({
    volumeIds,
    onModalClose,
}: DeleteVolumeModalContentProps) {
    const [runMassEditAction] = useMassEditMutation();

    const [deleteFiles, setDeleteFiles] = useState(false);

    const { data: allVolumes = [] } = useGetVolumesQuery();

    const volumes = useMemo(() => {
        return allVolumes.filter((v) => volumeIds.includes(v.id));
    }, [volumeIds, allVolumes]);

    const onDeleteFilesChange = useCallback(
        ({ value }: CheckInputChanged<'deleteFiles'>) => {
            setDeleteFiles(value);
        },
        [],
    );

    const onDeleteVolumeConfirmed = useCallback(() => {
        setDeleteFiles(false);

        runMassEditAction({
            action: massEditActions.DELETE,
            volumeIds,
            args: {
                deleteFolder: deleteFiles,
            },
        });

        onModalClose();
    }, [volumeIds, deleteFiles, onModalClose, runMassEditAction]);

    const { totalIssueFileCount, totalSizeOnDisk } = useMemo(() => {
        return volumes.reduce(
            (acc, { totalSize, issueFileCount }) => {
                acc.totalIssueFileCount += issueFileCount;
                acc.totalSizeOnDisk += totalSize;

                return acc;
            },
            {
                totalIssueFileCount: 0,
                totalSizeOnDisk: 0,
            },
        );
    }, [volumes]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('DeleteSelectedVolume')}</ModalHeader>

            <ModalBody>
                <div>
                    <FormGroup>
                        <FormLabel>
                            {volumes.length > 1
                                ? translate('DeleteVolumeFolders')
                                : translate('DeleteVolumeFolder')}
                        </FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="deleteFiles"
                            value={deleteFiles}
                            helpText={
                                volumes.length > 1
                                    ? translate('DeleteVolumeFoldersHelpText')
                                    : translate('DeleteVolumeFolderHelpText')
                            }
                            kind="danger"
                            onChange={onDeleteFilesChange}
                        />
                    </FormGroup>
                </div>

                <div className={styles.message}>
                    {deleteFiles
                        ? translate(
                              'DeleteVolumeFolderCountWithFilesConfirmation',
                              {
                                  count: volumes.length,
                              },
                          )
                        : translate('DeleteVolumeFolderCountConfirmation', {
                              count: volumes.length,
                          })}
                </div>

                <ul>
                    {volumes.map(
                        ({ title, folder, issueFileCount, totalSize }) => (
                            <li key={title}>
                                <span>{title}</span>

                                {deleteFiles && (
                                    <span>
                                        <span className={styles.pathContainer}>
                                            -
                                            <span className={styles.path}>
                                                {folder}
                                            </span>
                                        </span>

                                        {Boolean(issueFileCount) && (
                                            <span className={styles.statistics}>
                                                (
                                                {translate(
                                                    'DeleteVolumeFolderIssueCount',
                                                    {
                                                        issueFileCount,
                                                        size: formatBytes(
                                                            totalSize,
                                                        ),
                                                    },
                                                )}
                                                )
                                            </span>
                                        )}
                                    </span>
                                )}
                            </li>
                        ),
                    )}
                </ul>

                {deleteFiles && Boolean(totalIssueFileCount) ? (
                    <div className={styles.deleteFilesMessage}>
                        {translate('DeleteVolumeFolderIssueCount', {
                            issueFileCount: totalIssueFileCount,
                            size: formatBytes(totalSizeOnDisk),
                        })}
                    </div>
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button kind={kinds.DANGER} onPress={onDeleteVolumeConfirmed}>
                    {translate('Delete')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}
