// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { addRootFolder, fetchRootFolders } from 'Store/Actions/rootFolderActions';

// Misc
import { icons, kinds, sizes } from 'Helpers/Props';

import RootFolders from 'RootFolder/RootFolders';
import usePrevious from 'Helpers/Hooks/usePrevious';
// import useIsWindows from 'System/useIsWindows';
import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';

// CSS
import styles from './ImportVolumeSelectFolder.module.css';

// Types
import type { InputChanged } from 'typings/inputs';

// IMPLEMENTATIONS

function ImportVolumeSelectFolder() {
    const dispatch = useDispatch();
    /*const { isFetching, isPopulated, isSaving, error, saveError, items } = useSelector(
        (state: AppState) => state.rootFolders,
    );*/
    const { isFetching, isPopulated, isSaving, error, saveError, items } = {
        isFetching: false,
        isPopulated: true,
        isSaving: false,
        error: undefined,
        saveError: undefined,
        items: [] as { id: number }[],
    };

    const isWindows = false; // useIsWindows();

    const [isAddNewRootFolderModalOpen, setIsAddNewRootFolderModalOpen] = useState(false);

    const wasSaving = usePrevious(isSaving);

    const hasRootFolders = items.length > 0;
    const goodFolderExample = isWindows ? 'C:\\tv shows' : '/tv shows';
    const badFolderExample = isWindows ? 'C:\\tv shows\\the simpsons' : '/tv shows/the simpsons';

    const handleAddNewRootFolderPress = useCallback(() => {
        setIsAddNewRootFolderModalOpen(true);
    }, []);

    const handleAddRootFolderModalClose = useCallback(() => {
        setIsAddNewRootFolderModalOpen(false);
    }, []);

    const handleNewRootFolderSelect = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        ({ value }: InputChanged<string>) => {
            // dispatch(addRootFolder({ path: value }));
        },
        [dispatch],
    );

    useEffect(() => {
        // dispatch(fetchRootFolders());
    }, [dispatch]);

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            items.reduce((acc, item) => {
                if (item.id > acc) {
                    return item.id;
                }

                return acc;
            }, 0);
        }
    }, [isSaving, wasSaving, saveError, items]);

    return (
        <PageContent title={translate('ImportVolume')}>
            <PageContentBody>
                {isFetching && !isPopulated ? <LoadingIndicator /> : null}

                {!isFetching && error ? (
                    <Alert kind={kinds.DANGER}>{translate('RootFoldersLoadError')}</Alert>
                ) : null}

                {!error && isPopulated && (
                    <div>
                        <div className={styles.header}>
                            {translate('LibraryImportVolumeHeader')}
                        </div>

                        <div className={styles.tips}>
                            {translate('LibraryImportTips')}
                            <ul>
                                <li className={styles.tip}>
                                    <InlineMarkdown
                                        data={translate('LibraryImportTipsQualityInIssueFilename')}
                                    />
                                </li>
                                <li className={styles.tip}>
                                    <InlineMarkdown
                                        data={translate('LibraryImportTipsVolumeUseRootFolder', {
                                            goodFolderExample,
                                            badFolderExample,
                                        })}
                                    />
                                </li>
                                <li className={styles.tip}>
                                    {translate('LibraryImportTipsDontUseDownloadsFolder')}
                                </li>
                            </ul>
                        </div>

                        {hasRootFolders ? (
                            <div className={styles.recentFolders}>
                                <FieldSet legend={translate('RootFolders')}>
                                    <RootFolders />
                                </FieldSet>
                            </div>
                        ) : null}

                        {!isSaving && saveError ? (
                            <Alert className={styles.addErrorAlert} kind={kinds.DANGER}>
                                {translate('AddRootFolderError')}

                                <ul>
                                    {/*Array.isArray(saveError.responseJSON) ? (
                                        saveError.responseJSON.map((e, index) => {
                                            return <li key={index}>{e.errorMessage}</li>;
                                        })
                                    ) : (
                                        <li>{JSON.stringify(saveError.responseJSON)}</li>
                                    )*/}
                                </ul>
                            </Alert>
                        ) : null}

                        <div className={hasRootFolders ? undefined : styles.startImport}>
                            <Button
                                kind={kinds.PRIMARY}
                                size={sizes.LARGE}
                                onPress={handleAddNewRootFolderPress}
                            >
                                <Icon className={styles.importButtonIcon} name={icons.DRIVE} />
                                {hasRootFolders
                                    ? translate('ChooseAnotherFolder')
                                    : translate('StartImport')}
                            </Button>
                        </div>

                        <FileBrowserModal
                            isOpen={isAddNewRootFolderModalOpen}
                            name="rootFolderPath"
                            value=""
                            onChange={handleNewRootFolderSelect}
                            onModalClose={handleAddRootFolderModalClose}
                        />
                    </div>
                )}
            </PageContentBody>
        </PageContent>
    );
}

export default ImportVolumeSelectFolder;
