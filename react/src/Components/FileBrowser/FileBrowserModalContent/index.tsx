// TODO:
// IMPORTS

// React
import { useCallback, useEffect, useRef, useState } from 'react';

// Redux
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { clearPaths, fetchPaths } from 'Store/Actions/pathActions';
// import createSystemStatusSelector from 'Store/Selectors/createSystemStatusSelector';
// import createPathsSelector from './createPathsSelector';

// Misc
import { kinds, scrollDirections } from 'Helpers/Props';

import usePrevious from 'Helpers/Hooks/usePrevious';
import translate from 'Utilities/String/translate';

// General Components
import { PathInputInternal } from 'Components/Form/PathInput';

import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Scroller from 'Components/Scroller/Scroller';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';

// Specific Components
import FileBrowserRow from '../FileBrowserRow';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { InputChanged } from 'typings/inputs';

export interface FileBrowserModalContentProps {
    name: string;
    value: string;
    includeFiles?: boolean;
    onChange: (args: InputChanged<string>) => unknown;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

// FIXME: set the right type
const columns: Column<string>[] = [
    {
        name: 'type',
        label: () => translate('Type'),
        isVisible: true,
    },
    {
        name: 'name',
        label: () => translate('Name'),
        isVisible: true,
    },
];

const handleClearPaths = () => {};

function FileBrowserModalContent({
    name,
    value,
    includeFiles = true,
    onChange,
    onModalClose,
}: FileBrowserModalContentProps) {
    const dispatch = useDispatch();

    // const { isWindows, mode } = useSelector(createSystemStatusSelector());
    /*const { isFetching, isPopulated, error, parent, directories, files, paths } =
        useSelector(createPathsSelector());*/

    const isFetching = false;
    const isPopulated = true;
    const error = undefined;
    // @ts-expect-error TODO
    const paths = [];
    // @ts-expect-error TODO
    const directories = [];
    // @ts-expect-error TODO
    const files = [];
    const parent = '';

    const [currentPath, setCurrentPath] = useState(value);
    const scrollerRef = useRef(null);
    const previousValue = usePrevious(value);

    const emptyParent = parent === '';
    const isWindowsService = false; // isWindows && mode === 'service';

    const handlePathInputChange = useCallback(({ value }: InputChanged<string>) => {
        setCurrentPath(value);
    }, []);

    const handleRowPress = useCallback(
        (path: string) => {
            setCurrentPath(path);

            /*
            dispatch(
                fetchPaths({
                    path,
                    allowFoldersWithoutTrailingSlashes: true,
                    includeFiles,
                }),
            );
            */
        },
        [includeFiles, dispatch, setCurrentPath],
    );

    const handleOkPress = useCallback(() => {
        onChange({
            name,
            value: currentPath,
        });

        // dispatch(clearPaths());
        onModalClose();
    }, [name, currentPath, dispatch, onChange, onModalClose]);

    const handleFetchPaths = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (path: string) => {
            /*
            dispatch(
                fetchPaths({
                    path,
                    allowFoldersWithoutTrailingSlashes: true,
                    includeFiles,
                }),
            );
            */
        },
        [includeFiles, dispatch],
    );

    useEffect(() => {
        if (value !== previousValue && value !== currentPath) {
            setCurrentPath(value);
        }
    }, [value, previousValue, currentPath, setCurrentPath]);

    useEffect(
        () => {
            /*
            dispatch(
                fetchPaths({
                    path: currentPath,
                    allowFoldersWithoutTrailingSlashes: true,
                    includeFiles,
                }),
            );
            */

            return () => {
                // dispatch(clearPaths());
            };
        },
        // This should only run once when the component mounts,
        // so we don't need to include the other dependencies.

        [dispatch],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('FileBrowser')}</ModalHeader>

            <ModalBody className={styles.modalBody} scrollDirection={scrollDirections.NONE}>
                {isWindowsService ? (
                    <Alert className={styles.mappedDrivesWarning} kind={kinds.WARNING}>
                        <InlineMarkdown
                            data={translate('MappedNetworkDrivesWindowsService', {
                                url: 'https://wiki.servarr.com/sonarr/faq#why-cant-sonarr-see-my-files-on-a-remote-server',
                            })}
                        />
                    </Alert>
                ) : null}

                <PathInputInternal
                    className={styles.pathInput}
                    placeholder={translate('FileBrowserPlaceholderText')}
                    hasFileBrowser={false}
                    includeFiles={includeFiles}
                    // @ts-expect-error TODO
                    paths={paths}
                    name={name}
                    value={currentPath}
                    onChange={handlePathInputChange}
                    onFetchPaths={handleFetchPaths}
                    onClearPaths={handleClearPaths}
                />

                <Scroller ref={scrollerRef} className={styles.scroller} scrollDirection="both">
                    {error ? <div>{translate('ErrorLoadingContents')}</div> : null}

                    {isPopulated && !error ? (
                        <Table horizontalScroll={false} columns={columns}>
                            <TableBody>
                                {emptyParent ? (
                                    <FileBrowserRow
                                        type="computer"
                                        name={translate('MyComputer')}
                                        path={parent}
                                        onPress={handleRowPress}
                                    />
                                ) : null}

                                {!emptyParent && parent ? (
                                    <FileBrowserRow
                                        type="parent"
                                        name="..."
                                        path={parent}
                                        onPress={handleRowPress}
                                    />
                                ) : null}

                                {/* @ts-expect-error TODO */}
                                {directories.map((directory) => {
                                    return (
                                        <FileBrowserRow
                                            key={directory.path}
                                            type={directory.type}
                                            name={directory.name}
                                            path={directory.path}
                                            onPress={handleRowPress}
                                        />
                                    );
                                })}

                                {/* @ts-expect-error TODO */}
                                {files.map((file) => {
                                    return (
                                        <FileBrowserRow
                                            key={file.path}
                                            type={file.type}
                                            name={file.name}
                                            path={file.path}
                                            onPress={handleRowPress}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : null}
                </Scroller>
            </ModalBody>

            <ModalFooter>
                {isFetching ? <LoadingIndicator className={styles.loading} size={20} /> : null}

                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button onPress={handleOkPress}>{translate('Ok')}</Button>
            </ModalFooter>
        </ModalContent>
    );
}

export default FileBrowserModalContent;
