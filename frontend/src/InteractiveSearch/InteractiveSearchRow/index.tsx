// IMPORTS

// React
import { useCallback, useMemo, useState, type RefObject } from 'react';

// Redux
import { useAddDownloadMutation } from 'Store/Api/Command';

// Misc
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

import { filesize } from 'filesize';
import classNames from 'classnames';

// Hooks
import { useInView } from 'react-intersection-observer';

// General Components
import ConfirmModal from 'Components/Modal/ConfirmModal';
import Icon from 'Components/Icon';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import Menu from 'Components/Menu/Menu';
import MenuContent from 'Components/Menu/MenuContent';
import SelectedMenuItem from 'Components/Menu/SelectedMenuItem';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import Popover from 'Components/Tooltip/Popover';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import TextInput from 'Components/Form/TextInput';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { InputChanged } from 'typings/Inputs';
import type { InteractiveSearchPayload } from 'typings/Search';
import type { InteractiveSearchColumnName } from 'InteractiveSearch/columns';
import type { SearchResultItem } from 'InteractiveSearch';
import type { DownloadSource } from 'Helpers/Props/downloadSources';

interface InteractiveSearchRowProps {
    columns: Column<InteractiveSearchColumnName>[];
    result: SearchResultItem;
    items: SearchResultItem[];
    searchPayload: InteractiveSearchPayload;
    isLibgenEnabled: boolean;
    grabCallbacksRef: RefObject<(() => void)[]>;
}

// IMPLEMENTATIONS

function getDownloadIcon(
    isGrabbing: boolean,
    isGrabbed: boolean,
    isError: boolean,
) {
    if (isGrabbing) {
        return icons.SPINNER;
    }
    else if (isGrabbed) {
        return icons.DOWNLOADING;
    }
    else if (isError) {
        return icons.DOWNLOADING;
    }

    return icons.DOWNLOAD;
}

function getDownloadKind(isGrabbed: boolean, isError: boolean) {
    if (isGrabbed) {
        return kinds.SUCCESS;
    }

    if (isError) {
        return kinds.DANGER;
    }

    return kinds.DEFAULT_KIND;
}

function getDownloadTooltip(
    isGrabbing: boolean,
    isGrabbed: boolean,
    isError: boolean,
    errorMessage?: string,
) {
    if (isGrabbing) {
        return '';
    }
    else if (isGrabbed) {
        return translate('AddedToDownloadQueue');
    }
    else if (isError) {
        return errorMessage;
    }

    return translate('AddToDownloadQueue');
}

export default function InteractiveSearchRow({
    columns,
    result,
    items,
    searchPayload,
    isLibgenEnabled,
    grabCallbacksRef,
}: InteractiveSearchRowProps) {
    const { ref, inView } = useInView();
    const initialIssueNumber = useMemo(
        () =>
            Array.isArray(result.issueNumber)
                ? `${result.issueNumber[0]},${result.issueNumber[1]}`
                : (result.issueNumber?.toString() ?? ''),
        [result.issueNumber],
    );

    const initialReleaser = useMemo(
        () => result.releaser ?? '',
        [result.releaser],
    );
    const initialScanType = useMemo(
        () => result.scanType ?? '',
        [result.scanType],
    );
    const initialResolution = useMemo(
        () => result.resolution ?? '',
        [result.resolution],
    );
    const initialDpi = useMemo(() => result.dpi ?? '', [result.dpi]);

    const [issueNumber, setIssueNumber] = useState(initialIssueNumber);
    const [releaser, setReleaser] = useState(initialReleaser);
    const [scanType, setScanType] = useState(initialScanType);
    const [resolution, setResolution] = useState(initialResolution);
    const [dpi, setDpi] = useState(initialDpi);
    const [selectedSource, setSelectedSource] = useState<DownloadSource | null>(
        null,
    );

    const [gotMatchingFileInfo, setGotMatchingFileInfo] = useState(false);

    // Try to get file info from a Libgen result that we suspect is the same as this one
    if (isLibgenEnabled && !gotMatchingFileInfo) {
        if (result.source === 'GetComics' && result.match) {
            const resultSize = Number(
                filesize(result.filesize ?? 0, {
                    base: 2,
                    round: 0,
                }).replace(/ .*/, ''),
            );

            const libgenMatch = items.find((item) => {
                const itemSize = Number(
                    filesize(item.filesize ?? 0, {
                        base: 2,
                        round: 0,
                    }).replace(/ .*/, ''),
                );

                return (
                    item.match &&
                    item.source === 'Libgen+' &&
                    item.issueNumber === result.issueNumber &&
                    Math.abs(itemSize - resultSize) < 2
                );
            });

            if (libgenMatch) {
                setReleaser(libgenMatch.releaser ?? '');
                setScanType(libgenMatch.scanType ?? '');
                setResolution(libgenMatch.resolution ?? '');
                setDpi(libgenMatch.dpi ?? '');
            }
            setGotMatchingFileInfo(true);
        }
    }

    const [grabRelease, { isLoading, isGrabbed, isError, errorMessage }] =
        useAddDownloadMutation({
            selectFromResult: ({
                isLoading,
                isSuccess,
                isError: _isError,
                data,
                error,
            }) => {
                const isError = _isError || (data?.failReason ?? null) !== null;
                return {
                    isLoading,
                    isGrabbed: isSuccess && !isError,
                    isError,
                    errorMessage: data?.failReason ?? getErrorMessage(error),
                };
            },
        });

    const [_isGrabbing, setIsGrabbing] = useState(isLoading);

    const isGrabbing = _isGrabbing || isLoading;

    const onGrabPress = useCallback(
        (forceMatch = false) => {
            setIsGrabbing(true);
            const length = grabCallbacksRef.current.push(() => {
                grabRelease({
                    ...searchPayload,
                    result: {
                        ...result,
                        issueNumber: issueNumber.includes(',')
                            ? [
                                  parseFloat(issueNumber.split(',')[0]),
                                  parseFloat(issueNumber.split(',')[1]),
                              ]
                            : parseFloat(issueNumber),
                        releaser,
                        scanType,
                        resolution,
                        dpi,
                        selectedSource,
                    },
                    forceMatch,
                })
                    .unwrap()
                    .finally(() => {
                        grabCallbacksRef.current.shift();
                        grabCallbacksRef.current[0]?.();
                        setIsGrabbing(false);
                    });
            });

            if (length === 1) {
                grabCallbacksRef.current[0]?.();
            }
        },
        [
            grabCallbacksRef,
            grabRelease,
            result,
            searchPayload,
            issueNumber,
            releaser,
            scanType,
            resolution,
            dpi,
            selectedSource,
        ],
    );

    const [isConfirmGrabModalOpen, setIsConfirmGrabModalOpen] = useState(false);

    const onGrabPressWrapper = useCallback(() => {
        if (
            result.matchRejections.length === 0 ||
            /^\d+(\.\d+)?(,\d+(\.\d+)?){0,1}$/.test(issueNumber)
        ) {
            onGrabPress();

            return;
        }

        setIsConfirmGrabModalOpen(true);
    }, [issueNumber, onGrabPress, result.matchRejections]);

    const onOverridePress = useCallback(() => {
        onGrabPress(true);
    }, [onGrabPress]);

    const onGrabConfirm = useCallback(() => {
        setIsConfirmGrabModalOpen(false);

        onGrabPress();
    }, [onGrabPress]);

    const onGrabCancel = useCallback(() => {
        setIsConfirmGrabModalOpen(false);
    }, [setIsConfirmGrabModalOpen]);

    const handleIssueNumberChange = useCallback(
        ({ value }: InputChanged<'issueNumber', string>) => {
            setIssueNumber(value);
        },
        [],
    );

    const handleReleaserChange = useCallback(
        ({ value }: InputChanged<'releaser', string>) => {
            setReleaser(value);
        },
        [],
    );

    const handleScanTypeChange = useCallback(
        ({ value }: InputChanged<'scanType', string>) => {
            setScanType(value);
        },
        [],
    );

    const handleResolutionChange = useCallback(
        ({ value }: InputChanged<'resolution', string>) => {
            setResolution(value);
        },
        [],
    );

    const handleDpiChange = useCallback(
        ({ value }: InputChanged<'dpi', string>) => {
            setDpi(value);
        },
        [],
    );

    const handleSelectedSourceChange = useCallback(
        (value: DownloadSource | null) => {
            setSelectedSource(value);
        },
        [],
    );

    const finalColumns = inView ? columns : [];

    return (
        <TableRow
            ref={ref}
            // When out of view, we want rows to stay the same out.
            // 59.7px is the calculated height of a rendered row
            style={{ height: '59.7px' }}
        >
            {finalColumns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'match') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <Icon
                                name={result.match ? icons.CHECK : icons.CLOSE}
                                className={styles.matchIcon}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'issueNumber') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <TextInput
                                name="issueNumber"
                                value={issueNumber}
                                onChange={handleIssueNumberChange}
                                hasWarning={
                                    JSON.stringify(issueNumber) !==
                                    JSON.stringify(initialIssueNumber)
                                }
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'displayTitle') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <Link to={result.link}>{result.displayTitle}</Link>
                        </TableRowCell>
                    );
                }

                if (name === 'filesize') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {result.filesize
                                ? formatBytes(result.filesize)
                                : ''}
                        </TableRowCell>
                    );
                }

                if (name === 'pages') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {result.pages}
                        </TableRowCell>
                    );
                }

                if (name === 'releaser') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <TextInput
                                name="releaser"
                                value={releaser}
                                onChange={handleReleaserChange}
                                hasWarning={releaser !== initialReleaser}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'scanType') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <TextInput
                                name="scanType"
                                value={scanType}
                                onChange={handleScanTypeChange}
                                hasWarning={scanType !== initialScanType}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'resolution') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <TextInput
                                name="resolution"
                                value={resolution}
                                onChange={handleResolutionChange}
                                hasWarning={resolution !== initialResolution}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'dpi') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <TextInput
                                name="dpi"
                                value={dpi}
                                onChange={handleDpiChange}
                                hasWarning={dpi !== initialDpi}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'source') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {result.source}
                        </TableRowCell>
                    );
                }

                if (name === 'matchRejections') {
                    return (
                        <TableRowCell key={name} className={styles.rejected}>
                            {result.matchRejections.length ? (
                                <Popover
                                    anchor={
                                        <Icon
                                            name={icons.DANGER}
                                            kind={kinds.DANGER}
                                        />
                                    }
                                    title={translate('ReleaseRejected')}
                                    body={
                                        <ul>
                                            {result.matchRejections.map(
                                                (rejection, index) => {
                                                    return (
                                                        <li key={index}>
                                                            {rejection}
                                                        </li>
                                                    );
                                                },
                                            )}
                                        </ul>
                                    }
                                    position={tooltipPositions.LEFT}
                                />
                            ) : null}
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <Menu
                                className={classNames(
                                    styles.selectedSourceButton,
                                    styles.manualDownloadContent,
                                )}
                            >
                                <IconButton
                                    name={icons.TORRENT}
                                    title={translate('SelectDownloadSource')}
                                />
                                <MenuContent
                                    scrollerProps={{
                                        style: { overflow: 'unset' },
                                    }}
                                >
                                    <SelectedMenuItem
                                        isSelected={selectedSource === null}
                                        onPress={() => {
                                            handleSelectedSourceChange(null);
                                        }}
                                    >
                                        Auto
                                    </SelectedMenuItem>

                                    {result.downloadSources.map((source) => (
                                        <SelectedMenuItem
                                            isSelected={
                                                source === selectedSource
                                            }
                                            onPress={() => {
                                                handleSelectedSourceChange(
                                                    source,
                                                );
                                            }}
                                        >
                                            {source}
                                        </SelectedMenuItem>
                                    ))}
                                </MenuContent>
                            </Menu>

                            <SpinnerIconButton
                                name={getDownloadIcon(
                                    isGrabbing,
                                    isGrabbed,
                                    isError,
                                )}
                                kind={getDownloadKind(isGrabbed, isError)}
                                title={getDownloadTooltip(
                                    isGrabbing,
                                    isGrabbed,
                                    isError,
                                    errorMessage,
                                )}
                                isSpinning={isGrabbing}
                                onPress={onGrabPressWrapper}
                            />

                            <Link
                                className={styles.manualDownloadContent}
                                title={translate(
                                    'OverrideAndAddToDownloadQueue',
                                )}
                                onPress={onOverridePress}
                            >
                                <div className={styles.manualDownloadContent}>
                                    <Icon
                                        className={styles.interactiveIcon}
                                        name={icons.INTERACTIVE}
                                        size={12}
                                    />

                                    <Icon
                                        className={styles.downloadIcon}
                                        name={icons.CIRCLE_DOWN}
                                        size={10}
                                    />
                                </div>
                            </Link>
                        </TableRowCell>
                    );
                }
            })}

            <ConfirmModal
                isOpen={isConfirmGrabModalOpen}
                kind={kinds.WARNING}
                title={translate('GrabRelease')}
                message={translate(
                    'GrabReleaseUnknownVolumeOrIssueMessageText',
                    {
                        title: result.displayTitle,
                    },
                )}
                confirmLabel={translate('Grab')}
                onConfirm={onGrabConfirm}
                onCancel={onGrabCancel}
            />
        </TableRow>
    );
}
