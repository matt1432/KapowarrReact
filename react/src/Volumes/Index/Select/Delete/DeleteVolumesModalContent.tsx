import { orderBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { type AppState } from 'App/State/AppState';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { inputTypes, kinds } from 'Helpers/Props';
import { type Volumes } from 'Volumes/Volumes';
// import { bulkDeleteVolumes, setDeleteOption } from 'Store/Actions/volumesActions';
import createAllVolumesSelector from 'Store/Selectors/createAllVolumesSelector';
import { type InputChanged } from 'typings/inputs';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './DeleteVolumesModalContent.module.css';

interface DeleteVolumesModalContentProps {
    volumesIds: number[];
    onModalClose(): void;
}

const selectDeleteOptions = createSelector(
    (state: AppState) => state.volumes.deleteOptions,
    (deleteOptions) => deleteOptions,
);

function DeleteVolumesModalContent(props: DeleteVolumesModalContentProps) {
    const { volumesIds, onModalClose } = props;

    const { addImportListExclusion } = useSelector(selectDeleteOptions);
    const allVolumes: Volumes[] = useSelector(createAllVolumesSelector());
    const dispatch = useDispatch();

    const [deleteFiles, setDeleteFiles] = useState(false);

    const volumes = useMemo((): Volumes[] => {
        const volumesList = volumesIds.map((id) => {
            return allVolumes.find((s) => s.id === id);
        }) as Volumes[];

        return orderBy(volumesList, ['sortTitle']);
    }, [volumesIds, allVolumes]);

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

    const onDeleteVolumesConfirmed = useCallback(() => {
        setDeleteFiles(false);

        /*
        dispatch(
            bulkDeleteVolumes({
                volumesIds,
                deleteFiles,
                addImportListExclusion,
            }),
        );*/

        onModalClose();
    }, [volumesIds, deleteFiles, addImportListExclusion, setDeleteFiles, dispatch, onModalClose]);

    const { totalIssueFileCount, totalSizeOnDisk } = useMemo(() => {
        return volumes.reduce(
            (acc, { statistics = {} }) => {
                const { issueFileCount = 0, sizeOnDisk = 0 } = statistics;

                acc.totalIssueFileCount += issueFileCount;
                acc.totalSizeOnDisk += sizeOnDisk;

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
            <ModalHeader>{translate('DeleteSelectedVolumes')}</ModalHeader>

            <ModalBody>
                <div>
                    <FormGroup>
                        <FormLabel>{translate('AddListExclusion')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="addImportListExclusion"
                            value={addImportListExclusion}
                            helpText={translate('AddListExclusionVolumesHelpText')}
                            onChange={onDeleteOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            {volumes.length > 1
                                ? translate('DeleteVolumesFolders')
                                : translate('DeleteVolumesFolder')}
                        </FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="deleteFiles"
                            value={deleteFiles}
                            helpText={
                                volumes.length > 1
                                    ? translate('DeleteVolumesFoldersHelpText')
                                    : translate('DeleteVolumesFolderHelpText')
                            }
                            kind="danger"
                            onChange={onDeleteFilesChange}
                        />
                    </FormGroup>
                </div>

                <div className={styles.message}>
                    {deleteFiles
                        ? translate('DeleteVolumesFolderCountWithFilesConfirmation', {
                              count: volumes.length,
                          })
                        : translate('DeleteVolumesFolderCountConfirmation', {
                              count: volumes.length,
                          })}
                </div>

                <ul>
                    {volumes.map(({ title, path, statistics = {} }) => {
                        const { issueFileCount = 0, sizeOnDisk = 0 } = statistics;

                        return (
                            <li key={title}>
                                <span>{title}</span>

                                {deleteFiles && (
                                    <span>
                                        <span className={styles.pathContainer}>
                                            -<span className={styles.path}>{path}</span>
                                        </span>

                                        {!!issueFileCount && (
                                            <span className={styles.statistics}>
                                                (
                                                {translate('DeleteVolumesFolderIssueCount', {
                                                    issueFileCount,
                                                    size: formatBytes(sizeOnDisk),
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
                        {translate('DeleteVolumesFolderIssueCount', {
                            issueFileCount: totalIssueFileCount,
                            size: formatBytes(totalSizeOnDisk),
                        })}
                    </div>
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button kind={kinds.DANGER} onPress={onDeleteVolumesConfirmed}>
                    {translate('Delete')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default DeleteVolumesModalContent;
