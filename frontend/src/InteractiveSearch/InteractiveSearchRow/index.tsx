// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useAddDownloadMutation } from 'Store/Api/Command';

// Misc
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import ConfirmModal from 'Components/Modal/ConfirmModal';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
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
import type {
    InteractiveSearchPayload,
    InteractiveSearchSort,
    SearchResult,
} from 'typings/Search';

interface InteractiveSearchRowProps {
    columns: Column<InteractiveSearchSort>[];
    result: SearchResult;
    searchPayload: InteractiveSearchPayload;
}

// IMPLEMENTATIONS

function getDownloadIcon(
    isGrabbing: boolean,
    isGrabbed: boolean,
    isError: boolean,
    isTorrent = false,
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

    return isTorrent ? icons.TORRENT : icons.DOWNLOAD;
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
    isTorrent = false,
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

    return isTorrent
        ? translate('AddTorrentToDownloadQueue')
        : translate('AddToDownloadQueue');
}

export default function InteractiveSearchRow({
    columns,
    result,
    searchPayload,
}: InteractiveSearchRowProps) {
    const [issueNumber, setIssueNumber] = useState(
        Array.isArray(result.issueNumber)
            ? `${result.issueNumber[0]},${result.issueNumber[1]}`
            : (result.issueNumber?.toString() ?? ''),
    );
    const [releaser, setReleaser] = useState(result.releaser ?? '');
    const [scanType, setScanType] = useState(result.scanType ?? '');
    const [resolution, setResolution] = useState(result.resolution ?? '');
    const [dpi, setDpi] = useState(result.dpi ?? '');

    const [
        grabRelease,
        {
            isLoading: isGrabbing,
            isSuccess: isGrabbed,
            isError,
            error: grabError,
        },
    ] = useAddDownloadMutation();

    const [
        grabTorrentRelease,
        {
            isLoading: isGrabbingTorrent,
            isSuccess: isTorrentGrabbed,
            isError: isTorrentError,
            error: grabTorrentError,
        },
    ] = useAddDownloadMutation();

    const onGrabPress = useCallback(
        (forceMatch = false, isTorrent = false) => {
            const grab = isTorrent ? grabTorrentRelease : grabRelease;
            grab({
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
                    comicsId: isTorrent ? result.comicsId : null,
                },
                forceMatch,
            });
        },
        [
            grabRelease,
            grabTorrentRelease,
            result,
            searchPayload,
            issueNumber,
            releaser,
            scanType,
            resolution,
            dpi,
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

    const onGrabTorrentPressWrapper = useCallback(() => {
        onGrabPress(false, true);
    }, [onGrabPress]);

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

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'match') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <Icon
                                name={result.match ? icons.CHECK : icons.CLOSE}
                                className={styles.matchIcon}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'issueNumber') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <TextInput
                                name="issueNumber"
                                value={issueNumber}
                                onChange={handleIssueNumberChange}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'displayTitle') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <Link to={result.link}>{result.displayTitle}</Link>
                        </TableRowCell>
                    );
                }

                if (name === 'filesize') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {formatBytes(result.filesize)}
                        </TableRowCell>
                    );
                }

                if (name === 'pages') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {result.pages}
                        </TableRowCell>
                    );
                }

                if (name === 'releaser') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <TextInput
                                name="releaser"
                                value={releaser}
                                onChange={handleReleaserChange}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'scanType') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <TextInput
                                name="scanType"
                                value={scanType}
                                onChange={handleScanTypeChange}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'resolution') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <TextInput
                                name="resolution"
                                value={resolution}
                                onChange={handleResolutionChange}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'dpi') {
                    return (
                        <TableRowCell className={styles[name]}>
                            <TextInput
                                name="dpi"
                                value={dpi}
                                onChange={handleDpiChange}
                            />
                        </TableRowCell>
                    );
                }

                if (name === 'source') {
                    return (
                        <TableRowCell className={styles[name]}>
                            {result.source}
                        </TableRowCell>
                    );
                }

                if (name === 'matchRejections') {
                    return (
                        <TableRowCell className={styles.rejected}>
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
                        <TableRowCell className={styles[name]}>
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
                                    getErrorMessage(grabError),
                                )}
                                isSpinning={isGrabbing}
                                onPress={onGrabPressWrapper}
                            />

                            <SpinnerIconButton
                                name={getDownloadIcon(
                                    isGrabbingTorrent,
                                    isTorrentGrabbed,
                                    isTorrentError,
                                    true,
                                )}
                                kind={getDownloadKind(
                                    isTorrentGrabbed,
                                    isTorrentError,
                                )}
                                title={getDownloadTooltip(
                                    isGrabbingTorrent,
                                    isTorrentGrabbed,
                                    isTorrentError,
                                    getErrorMessage(grabTorrentError),
                                    true,
                                )}
                                isSpinning={isGrabbingTorrent}
                                isDisabled={!result.comicsId}
                                onPress={onGrabTorrentPressWrapper}
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
