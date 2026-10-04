// IMPORTS

// React
import { useCallback, useMemo, useRef, useState, type RefObject } from 'react';

import {
    useListRef,
    type ListImperativeAPI,
    type RowComponentProps,
} from 'react-window';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import {
    useDeletePagesMutation,
    useFindSimilarPagesMutation,
    useGetFileQuery,
} from 'Store/Api/Files';
import { useUpdateBookPagesMutation } from 'Store/Api/Issues';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Button from 'Components/Link/Button';
import IconButton from 'Components/Link/IconButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import SpinnerErrorButton from 'Components/Link/SpinnerErrorButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import TextInput from 'Components/Form/TextInput';
import VirtualTable from 'Components/Table/VirtualTable';
import SimilarPagesModal, {
    type SimilarPageItem,
} from 'Components/SimilarPagesModal';

// CSS
import styles from './index.module.css';

// Types
import type { PageReference } from 'Store/Api/Files';
import type { ThumbnailData } from 'Store/Api/Issues';
import type { InputChanged } from 'typings/Inputs';

interface RowProps {
    thumbnails: ThumbnailData[];
    handlePressUp: (index: number) => () => void;
    handlePressDown: (index: number) => () => void;
    handlePressBump: (index: number) => () => void;
    handlePressDelete: (index: number) => () => void;
    handlePressFindSimilar: (index: number) => () => void;
    handleEditFilename: (
        index: number,
    ) => (change: InputChanged<'filename', string>) => void;
}

export interface EditPagesModalContentProps {
    fileId: number;
    thumbnails: ThumbnailData[] | undefined;
    isRefreshing: boolean;
    onRefresh: () => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function parsePageNumbers(
    filename: string,
    prefix: string,
): string | [string, string, string] {
    const strippedName = filename
        .replace(prefix, '')
        .replace(/\.[^.]*$/, '')
        .trim();

    const separator = strippedName.replace(/\d/g, '');

    if (separator === '') {
        return strippedName;
    }

    const parsedNumbers = strippedName.split(separator);

    if (parsedNumbers[1] === '') {
        return strippedName;
    }

    return [parsedNumbers[0], parsedNumbers[1], separator];
}

function swapThumbnailPositions([first, secnd]: [
    ThumbnailData,
    ThumbnailData,
]): [ThumbnailData, ThumbnailData] {
    const prefix = first.prefix;

    let newFirstFilename = secnd.newFilename;
    let newSecndFilename = first.newFilename;

    const firstNumbers = parsePageNumbers(first.newFilename, prefix);
    const secndNumbers = parsePageNumbers(secnd.newFilename, prefix);

    if (typeof firstNumbers === 'string' && typeof secndNumbers !== 'string') {
        const separator = secndNumbers[2];
        newFirstFilename = first.newFilename.replace(
            firstNumbers,
            secndNumbers[1],
        );
        newSecndFilename = secnd.newFilename.replace(
            `${secndNumbers[0]}${separator}${secndNumbers[1]}`,
            `${firstNumbers}${separator}${secndNumbers[0]}`,
        );
    }
    else if (
        typeof firstNumbers !== 'string' &&
        typeof secndNumbers === 'string'
    ) {
        const separator = firstNumbers[2];
        newFirstFilename = first.newFilename.replace(
            `${firstNumbers[0]}${separator}${firstNumbers[1]}`,
            `${firstNumbers[1]}${separator}${secndNumbers}`,
        );
        newSecndFilename = secnd.newFilename.replace(
            secndNumbers,
            firstNumbers[0],
        );
    }

    return [
        {
            ...secnd,
            newFilename: newSecndFilename,
        },
        {
            ...first,
            newFilename: newFirstFilename,
        },
    ];
}

function _bumpNumber(num: string): string {
    const string_value = /(\d+)/.exec(num)?.[0];
    if (!string_value) {
        return '';
    }
    const value = parseFloat(string_value) + 1;
    const new_string_value = `${Array.from({ length: string_value.length - value.toString().length }, () => '0').join('')}${value.toString()}`;
    return num.replace(string_value, new_string_value);
}

function bumpThumbnailNumber(thumbnail: ThumbnailData): ThumbnailData {
    const prefix = thumbnail.prefix;

    let newFilename = thumbnail.newFilename;

    const numbers = parsePageNumbers(newFilename, prefix);

    if (typeof numbers === 'string') {
        newFilename = thumbnail.newFilename.replace(
            numbers,
            _bumpNumber(numbers),
        );
    }
    else {
        const separator = numbers[2];
        newFilename = thumbnail.newFilename.replace(
            `${numbers[0]}${separator}${numbers[1]}`,
            `${_bumpNumber(numbers[0])}${separator}${_bumpNumber(numbers[1])}`,
        );
    }

    return {
        ...thumbnail,
        newFilename,
    };
}

function Row({
    index,
    style,
    thumbnails,
    handlePressUp,
    handlePressDown,
    handlePressBump,
    handlePressDelete,
    handlePressFindSimilar,
    handleEditFilename,
}: RowComponentProps<RowProps>) {
    const { src, newFilename } = thumbnails[index];

    const isLast = index === thumbnails.length - 1;

    return (
        <div
            className={styles.row}
            style={{
                borderBottom: isLast ? undefined : 'solid white 1px',
                ...style,
            }}
        >
            <div className={styles.imageContainer}>
                <img
                    // The image at the provided link can change over time
                    // Update it every time we open this window
                    src={`${src}&${new Date().getTime()}`}
                    height={600}
                />

                <div className={styles.buttons}>
                    <IconButton
                        name={icons.ARROW_UP}
                        onPress={handlePressUp(index)}
                        isDisabled={index === 0}
                    />

                    <IconButton
                        name={icons.DELETE}
                        onPress={handlePressDelete(index)}
                    />

                    <IconButton
                        name={icons.ARROW_DOWN}
                        onPress={handlePressDown(index)}
                        isDisabled={isLast}
                    />

                    <IconButton
                        name={icons.ADD}
                        title="Bump this and all following pages' numbers by one"
                        onPress={handlePressBump(index)}
                        isDisabled={isLast}
                    />

                    <IconButton
                        name={icons.CLONE}
                        title={translate('FindSimilarPages')}
                        onPress={handlePressFindSimilar(index)}
                    />
                </div>
            </div>

            <div className={styles.inputContainer}>
                <TextInput
                    name="filename"
                    value={newFilename}
                    onChange={handleEditFilename(index)}
                />
            </div>
        </div>
    );
}

export default function EditPagesModalContent({
    fileId,
    thumbnails,
    onRefresh,
    isRefreshing,
    onModalClose,
}: EditPagesModalContentProps) {
    const { title } = useGetFileQuery(
        { fileId },
        {
            refetchOnMountOrArgChange: true,
            selectFromResult: ({ data }) => ({
                title: data?.filepath?.split('/').at(-1) ?? '',
            }),
        },
    );

    // Table
    const { isSmallScreen } = useRootSelector((state) => state.app.dimensions);

    const scrollerRef = useRef<HTMLDivElement>(
        null,
    ) as RefObject<HTMLDivElement>;

    const listRef = useListRef(undefined) as RefObject<ListImperativeAPI>;

    // Edits
    const [changes, setChanges] = useState(thumbnails);

    const [prevThumbnails, setPrevThumbnails] = useState(thumbnails);
    if (thumbnails !== prevThumbnails) {
        setPrevThumbnails(thumbnails);
        setChanges(
            thumbnails?.toSorted((a, b) =>
                a.newFilename.localeCompare(b.newFilename),
            ),
        );
    }

    const [updateBookPages, { isLoading: isSaving, error: saveError }] =
        useUpdateBookPagesMutation();

    const handleSavePress = useCallback(() => {
        if (!changes) {
            return;
        }
        updateBookPages({
            fileId,
            newPages: changes,
        });
    }, [changes, fileId, updateBookPages]);

    const handlePressUp = useCallback(
        (index: number) => () => {
            if (!changes) {
                return;
            }

            const newThumbnails = [...changes];

            const swapped = swapThumbnailPositions([
                changes[index - 1],
                changes[index],
            ]);

            newThumbnails[index - 1] = swapped[0];
            newThumbnails[index] = swapped[1];

            setChanges(newThumbnails);
        },
        [changes],
    );

    const handlePressDown = useCallback(
        (index: number) => () => {
            if (!changes) {
                return;
            }

            const newThumbnails = [...changes];

            const swapped = swapThumbnailPositions([
                changes[index],
                changes[index + 1],
            ]);

            newThumbnails[index] = swapped[0];
            newThumbnails[index + 1] = swapped[1];

            setChanges(newThumbnails);
        },
        [changes],
    );

    const handlePressBump = useCallback(
        (index: number) => () => {
            if (!changes) {
                return;
            }

            const newThumbnails = [...changes];

            for (let i = index; i !== changes.length; i++) {
                newThumbnails[i] = bumpThumbnailNumber(newThumbnails[i]);
            }

            setChanges(newThumbnails);
        },
        [changes],
    );

    const handlePressDelete = useCallback(
        (index: number) => () => {
            if (!changes) {
                return;
            }

            const newThumbnails = [...changes];

            for (let i = index; i !== changes.length - 1; i++) {
                const swapped = swapThumbnailPositions([
                    changes[i],
                    changes[i + 1],
                ]);

                newThumbnails[i] = swapped[0];
                newThumbnails[i + 1] = swapped[1];
            }

            setChanges(newThumbnails.slice(0, -1));
        },
        [changes],
    );

    const handleEditFilename = useCallback(
        (index: number) =>
            ({ value }: InputChanged<'filename', string>) => {
                if (!changes) {
                    return;
                }

                const newThumbnails = [...changes];

                newThumbnails[index] = {
                    ...newThumbnails[index],
                    newFilename: value,
                };

                setChanges(newThumbnails);
            },
        [changes],
    );

    const [similarPagesReference, setSimilarPagesReference] = useState<
        string | undefined
    >();

    const [
        findSimilarPages,
        {
            data: similarPages,
            isLoading: isFindingSimilarPages,
            error: findSimilarPagesError,
        },
    ] = useFindSimilarPagesMutation();

    const [
        deletePages,
        { isLoading: isDeletingPages, error: deletePagesError },
    ] = useDeletePagesMutation();

    const handlePressFindSimilar = useCallback(
        (index: number) => () => {
            if (!changes) {
                return;
            }

            // The filename the page has inside the file, not the edited one
            const filename = changes[index].currentFilename;
            setSimilarPagesReference(filename);
            findSimilarPages({ fileId, filename });
        },
        [changes, fileId, findSimilarPages],
    );

    const handleSimilarPagesModalClose = useCallback(() => {
        setSimilarPagesReference(undefined);
    }, []);

    const similarPageItems = useMemo(() => {
        const items = new Map<string, SimilarPageItem & PageReference>();
        similarPages?.forEach(
            ({ fileId, filename, filepath, distance, src }) => {
                const id = JSON.stringify([fileId, filename]);
                items.set(id, {
                    id,
                    fileId,
                    filename,
                    src,
                    group: filepath.split('/').at(-1) ?? filepath,
                    label: filename,
                    distance,
                });
            },
        );
        return items;
    }, [similarPages]);

    const similarPagesList = useMemo(
        () => (similarPages ? [...similarPageItems.values()] : undefined),
        [similarPages, similarPageItems],
    );

    const handleDeleteSimilarPages = useCallback(
        async (ids: string[]) => {
            const pages = ids.map((id) => {
                const { fileId, filename } = similarPageItems.get(id)!;
                return { fileId, filename };
            });

            const { error } = await deletePages({ pages });
            if (error) {
                return;
            }

            setSimilarPagesReference(undefined);

            if (pages.some((page) => page.fileId === fileId)) {
                onRefresh();
            }
        },
        [deletePages, fileId, onRefresh, similarPageItems],
    );

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader className={styles.modalHeaderContainer}>
                <div className={styles.modalHeader}>
                    {translate('EditPagesModalHeader', { title })}
                </div>

                <SpinnerIconButton
                    name={icons.REFRESH}
                    className={styles.refreshButton}
                    size={18}
                    onPress={onRefresh}
                    isSpinning={isRefreshing}
                />
            </ModalHeader>

            <ModalBody>
                {changes ? (
                    <VirtualTable
                        Header={<></>}
                        listRef={listRef}
                        itemCount={changes.length}
                        itemData={{
                            thumbnails: changes,
                            handlePressUp,
                            handlePressDown,
                            handlePressBump,
                            handlePressDelete,
                            handlePressFindSimilar,
                            handleEditFilename,
                        }}
                        rowHeight={700}
                        isSmallScreen={isSmallScreen}
                        scrollerRef={scrollerRef}
                        Row={Row}
                    />
                ) : (
                    <LoadingIndicator />
                )}
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <SpinnerErrorButton
                    error={saveError}
                    isSpinning={isSaving}
                    onPress={handleSavePress}
                >
                    {translate('Save')}
                </SpinnerErrorButton>
            </ModalFooter>

            <SimilarPagesModal
                isOpen={similarPagesReference !== undefined}
                title={translate('SimilarPagesModalHeader', {
                    filename: similarPagesReference ?? '',
                })}
                message={translate('SimilarPagesDeleteMessage')}
                pages={similarPagesList}
                isFetching={isFindingSimilarPages}
                fetchError={findSimilarPagesError}
                confirmLabel={translate('DeletePages')}
                isConfirming={isDeletingPages}
                confirmError={deletePagesError}
                onConfirm={handleDeleteSimilarPages}
                onModalClose={handleSimilarPagesModalClose}
            />
        </ModalContent>
    );
}
