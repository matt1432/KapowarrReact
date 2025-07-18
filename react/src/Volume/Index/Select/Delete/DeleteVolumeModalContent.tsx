// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useDispatch /* , useSelector */ } from 'react-redux';
// import { createSelector } from 'reselect';
// import { bulkDeleteVolume, setDeleteOption } from 'Store/Actions/volumeActions';
// import createAllVolumeSelector from 'Store/Selectors/createAllVolumeSelector';

// Misc
import { orderBy } from 'lodash';
import { inputTypes, kinds } from 'Helpers/Props';

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
import styles from './DeleteVolumeModalContent.module.css';

// Types
import type { Volume } from 'Volume/Volume';
import type { InputChanged } from 'typings/inputs';

interface DeleteVolumeModalContentProps {
    volumeIds: number[];
    onModalClose(): void;
}

// IMPLEMENTATIONS

/*
const selectDeleteOptions = createSelector(
    (state: AppState) => state.volume.deleteOptions,
    (deleteOptions) => deleteOptions,
);
*/

function DeleteVolumeModalContent(props: DeleteVolumeModalContentProps) {
    const { volumeIds, onModalClose } = props;

    // const { addImportListExclusion } = useSelector(selectDeleteOptions);
    const allVolume: Volume[] = []; // useSelector(createAllVolumeSelector());
    const dispatch = useDispatch();

    const [deleteFiles, setDeleteFiles] = useState(false);

    const volumes = useMemo((): Volume[] => {
        const volumeList = volumeIds.map((id) => {
            return allVolume.find((s) => s.id === id);
        }) as Volume[];

        return orderBy(volumeList, ['sortTitle']);
    }, [volumeIds, allVolume]);

    const onDeleteFilesChange = useCallback(
        ({ value }: InputChanged<boolean>) => {
            setDeleteFiles(value);
        },
        [setDeleteFiles],
    );

    const onDeleteOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        ({ name, value }: { name: string; value: boolean }) => {
            /*
            dispatch(
                setDeleteOption({
                    [name]: value,
                }),
            );*/
        },
        [dispatch],
    );

    const onDeleteVolumeConfirmed = useCallback(() => {
        setDeleteFiles(false);

        /*
        dispatch(
            bulkDeleteVolume({
                volumeIds,
                deleteFiles,
                addImportListExclusion,
            }),
        );*/

        onModalClose();
    }, [
        volumeIds,
        deleteFiles,
        /* addImportListExclusion, */ setDeleteFiles,
        dispatch,
        onModalClose,
    ]);

    const { totalIssueFileCount, totalSizeOnDisk } = useMemo(() => {
        return volumes.reduce(
            (acc, { total_size, issues }) => {
                acc.totalIssueFileCount += issues.reduce(
                    (acc, issue) => acc + issue.files.length,
                    0,
                );
                acc.totalSizeOnDisk += total_size;

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
                        <FormLabel>{translate('AddListExclusion')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="addImportListExclusion"
                            value={'' /*addImportListExclusion*/}
                            helpText={translate('AddListExclusionVolumeHelpText')}
                            onChange={onDeleteOptionChange}
                        />
                    </FormGroup>

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
                        ? translate('DeleteVolumeFolderCountWithFilesConfirmation', {
                              count: volumes.length,
                          })
                        : translate('DeleteVolumeFolderCountConfirmation', {
                              count: volumes.length,
                          })}
                </div>

                <ul>
                    {volumes.map(({ title, folder, issues, total_size }) => {
                        const issueFileCount = issues.reduce(
                            (acc, issue) => acc + issue.files.length,
                            0,
                        );
                        return (
                            <li key={title}>
                                <span>{title}</span>

                                {deleteFiles && (
                                    <span>
                                        <span className={styles.pathContainer}>
                                            -<span className={styles.path}>{folder}</span>
                                        </span>

                                        {!!issueFileCount && (
                                            <span className={styles.statistics}>
                                                (
                                                {translate('DeleteVolumeFolderIssueCount', {
                                                    issueFileCount,
                                                    size: formatBytes(total_size),
                                                })}
                                                )
                                            </span>
                                        )}
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>

                {deleteFiles && !!totalIssueFileCount ? (
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

export default DeleteVolumeModalContent;
