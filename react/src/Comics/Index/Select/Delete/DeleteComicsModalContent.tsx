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
import { type Comics } from 'Comics/Comics';
// import { bulkDeleteComics, setDeleteOption } from 'Store/Actions/comicsActions';
import createAllComicsSelector from 'Store/Selectors/createAllComicsSelector';
import { type InputChanged } from 'typings/inputs';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';
import styles from './DeleteComicsModalContent.module.css';

interface DeleteComicsModalContentProps {
    comicsIds: number[];
    onModalClose(): void;
}

const selectDeleteOptions = createSelector(
    (state: AppState) => state.comics.deleteOptions,
    (deleteOptions) => deleteOptions,
);

function DeleteComicsModalContent(props: DeleteComicsModalContentProps) {
    const { comicsIds, onModalClose } = props;

    const { addImportListExclusion } = useSelector(selectDeleteOptions);
    const allComics: Comics[] = useSelector(createAllComicsSelector());
    const dispatch = useDispatch();

    const [deleteFiles, setDeleteFiles] = useState(false);

    const comics = useMemo((): Comics[] => {
        const comicsList = comicsIds.map((id) => {
            return allComics.find((s) => s.id === id);
        }) as Comics[];

        return orderBy(comicsList, ['sortTitle']);
    }, [comicsIds, allComics]);

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

    const onDeleteComicsConfirmed = useCallback(() => {
        setDeleteFiles(false);

        /*
        dispatch(
            bulkDeleteComics({
                comicsIds,
                deleteFiles,
                addImportListExclusion,
            }),
        );*/

        onModalClose();
    }, [comicsIds, deleteFiles, addImportListExclusion, setDeleteFiles, dispatch, onModalClose]);

    const { totalIssueFileCount, totalSizeOnDisk } = useMemo(() => {
        return comics.reduce(
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
    }, [comics]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('DeleteSelectedComics')}</ModalHeader>

            <ModalBody>
                <div>
                    <FormGroup>
                        <FormLabel>{translate('AddListExclusion')}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="addImportListExclusion"
                            value={addImportListExclusion}
                            helpText={translate('AddListExclusionComicsHelpText')}
                            onChange={onDeleteOptionChange}
                        />
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            {comics.length > 1
                                ? translate('DeleteComicsFolders')
                                : translate('DeleteComicsFolder')}
                        </FormLabel>

                        <FormInputGroup
                            type={inputTypes.CHECK}
                            name="deleteFiles"
                            value={deleteFiles}
                            helpText={
                                comics.length > 1
                                    ? translate('DeleteComicsFoldersHelpText')
                                    : translate('DeleteComicsFolderHelpText')
                            }
                            kind="danger"
                            onChange={onDeleteFilesChange}
                        />
                    </FormGroup>
                </div>

                <div className={styles.message}>
                    {deleteFiles
                        ? translate('DeleteComicsFolderCountWithFilesConfirmation', {
                              count: comics.length,
                          })
                        : translate('DeleteComicsFolderCountConfirmation', {
                              count: comics.length,
                          })}
                </div>

                <ul>
                    {comics.map(({ title, path, statistics = {} }) => {
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
                                                {translate('DeleteComicsFolderIssueCount', {
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
                        {translate('DeleteComicsFolderIssueCount', {
                            issueFileCount: totalIssueFileCount,
                            size: formatBytes(totalSizeOnDisk),
                        })}
                    </div>
                ) : null}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button kind={kinds.DANGER} onPress={onDeleteComicsConfirmed}>
                    {translate('Delete')}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default DeleteComicsModalContent;
