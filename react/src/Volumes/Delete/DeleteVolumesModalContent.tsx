import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppState } from 'App/State/AppState';
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
import { icons, inputTypes, kinds } from 'Helpers/Props';
import { type Statistics } from 'Volumes/Volumes';
import useVolumes from 'Volumes/useVolumes';
// import { deleteVolumes, setDeleteOption } from 'Store/Actions/volumesActions';
import { type CheckInputChanged } from 'typings/inputs';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './DeleteVolumesModalContent.module.css';

export interface DeleteVolumesModalContentProps {
    volumesId: number;
    onModalClose: () => void;
}

function DeleteVolumesModalContent({ volumesId, onModalClose }: DeleteVolumesModalContentProps) {
    const dispatch = useDispatch();
    const { title, path, statistics = {} as Statistics } = useVolumes(volumesId)!;
    const { addImportListExclusion } = useSelector((state: AppState) => state.volumes.deleteOptions);

    const { issueFileCount = 0, sizeOnDisk = 0 } = statistics;

    const [deleteFiles, setDeleteFiles] = useState(false);

    const handleDeleteFilesChange = useCallback(({ value }: CheckInputChanged) => {
        setDeleteFiles(value);
    }, []);

    const handleDeleteVolumesConfirmed = useCallback(() => {
        // dispatch(deleteVolumes({ id: volumesId, deleteFiles, addImportListExclusion }));

        onModalClose();
    }, [volumesId, addImportListExclusion, deleteFiles, dispatch, onModalClose]);

    const handleDeleteOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        ({ name, value }: CheckInputChanged) => {
            // dispatch(setDeleteOption({ [name]: value }));
        },
        [dispatch],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('DeleteVolumesModalHeader', { title })}</ModalHeader>

            <ModalBody>
                <div className={styles.pathContainer}>
                    <Icon className={styles.pathIcon} name={icons.FOLDER} />

                    {path}
                </div>

                <FormGroup>
                    <FormLabel>{translate('AddListExclusion')}</FormLabel>

                    <FormInputGroup
                        type={inputTypes.CHECK}
                        name="addImportListExclusion"
                        value={addImportListExclusion}
                        helpText={translate('AddListExclusionVolumesHelpText')}
                        onChange={handleDeleteOptionChange}
                    />
                </FormGroup>

                <FormGroup>
                    <FormLabel>
                        {issueFileCount === 0
                            ? translate('DeleteVolumesFolder')
                            : translate('DeleteIssuesFiles', { issueFileCount })}
                    </FormLabel>

                    <FormInputGroup
                        type={inputTypes.CHECK}
                        name="deleteFiles"
                        value={deleteFiles}
                        helpText={
                            issueFileCount === 0
                                ? translate('DeleteVolumesFolderHelpText')
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
                                data={translate('DeleteVolumesFolderConfirmation', { path })}
                                blockClassName={styles.folderPath}
                            />
                        </div>

                        {issueFileCount ? (
                            <div className={styles.deleteCount}>
                                {translate('DeleteVolumesFolderIssueCount', {
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

                <Button kind={kinds.DANGER} onPress={handleDeleteVolumesConfirmed}>
                    {translate('Delete')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default DeleteVolumesModalContent;
