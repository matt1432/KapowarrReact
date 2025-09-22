// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useAddDownloadMutation } from 'Store/Api/Command';
import { useGetQueueQuery } from 'Store/Api/Queue';

// Misc
import { icons, kinds, tooltipPositions } from 'Helpers/Props';
import { getErrorMessage } from 'Utilities/Object/error';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import ConfirmModal from 'Components/Modal/ConfirmModal';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import NumberInput from 'Components/Form/NumberInput';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import Popover from 'Components/Tooltip/Popover';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRow from 'Components/Table/TableRow';
import TextInput from 'Components/Form/TextInput';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';
import type { InteractiveSearchPayload, SearchResult } from 'typings/Search';

interface InteractiveSearchRowProps {
    searchPayload: InteractiveSearchPayload;
    result: SearchResult;
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

    return isTorrent ? translate('AddTorrentToDownloadQueue') : translate('AddToDownloadQueue');
}

export default function InteractiveSearchRow({ searchPayload, result }: InteractiveSearchRowProps) {
    const initialIssueNumber = useMemo(
        () => (Array.isArray(result.issueNumber) ? result.issueNumber[0] : result.issueNumber),
        [result.issueNumber],
    );
    const [issueNumber, setIssueNumber] = useState(initialIssueNumber);
    const [releaser, setReleaser] = useState(result.releaser ?? '');
    const [scanType, setScanType] = useState(result.scanType ?? '');
    const [resolution, setResolution] = useState(result.resolution ?? '');
    const [dpi, setDpi] = useState(result.dpi ?? '');

    const [
        grabRelease,
        { isLoading: isGrabbing, isSuccess: isGrabbed, isError, error: grabError },
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

    const { refetch } = useGetQueueQuery(undefined, {
        selectFromResult: () => ({}),
    });

    const onGrabPress = useCallback(
        (forceMatch = false, isTorrent = false) => {
            const grab = isTorrent ? grabTorrentRelease : grabRelease;
            grab({
                ...searchPayload,
                result: {
                    ...result,
                    issueNumber: Array.isArray(result.issueNumber)
                        ? result.issueNumber
                        : issueNumber,
                    releaser,
                    scanType,
                    resolution,
                    dpi,
                    comicsId: isTorrent ? result.comicsId : null,
                },
                forceMatch,
            }).then(() => {
                refetch();
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
            refetch,
            resolution,
            dpi,
        ],
    );

    const [isConfirmGrabModalOpen, setIsConfirmGrabModalOpen] = useState(false);

    const onGrabPressWrapper = useCallback(() => {
        if (result.matchRejections.length === 0 || typeof issueNumber === 'number') {
            onGrabPress();

            return;
        }

        setIsConfirmGrabModalOpen(true);
    }, [onGrabPress, issueNumber, result.matchRejections]);

    const onGrabTorrentPressWrapper = useCallback(() => {
        onGrabPress(true, true);
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
        ({ value }: InputChanged<'issueNumber', number | null>) => {
            setIssueNumber(value);
        },
        [],
    );

    const handleReleaserChange = useCallback(({ value }: InputChanged<'releaser', string>) => {
        setReleaser(value);
    }, []);

    const handleScanTypeChange = useCallback(({ value }: InputChanged<'scanType', string>) => {
        setScanType(value);
    }, []);

    const handleResolutionChange = useCallback(({ value }: InputChanged<'resolution', string>) => {
        setResolution(value);
    }, []);

    const handleDpiChange = useCallback(({ value }: InputChanged<'dpi', string>) => {
        setDpi(value);
    }, []);

    return (
        <TableRow>
            <TableRowCell className={styles.match}>
                <Icon
                    name={result.match ? icons.CHECK : icons.CLOSE}
                    className={styles.matchIcon}
                />
            </TableRowCell>

            <TableRowCell className={styles.issueNumber}>
                {Array.isArray(result.issueNumber) ? null : (
                    <NumberInput
                        name="issueNumber"
                        value={issueNumber}
                        onChange={handleIssueNumberChange}
                    />
                )}
            </TableRowCell>

            <TableRowCell className={styles.displayTitle}>
                <Link to={result.link}>{result.displayTitle}</Link>
            </TableRowCell>

            <TableRowCell className={styles.filesize}>{formatBytes(result.filesize)}</TableRowCell>

            <TableRowCell className={styles.pages}>{result.pages}</TableRowCell>

            <TableRowCell className={styles.releaser}>
                <TextInput name="releaser" value={releaser} onChange={handleReleaserChange} />
            </TableRowCell>

            <TableRowCell className={styles.scanType}>
                <TextInput name="scanType" value={scanType} onChange={handleScanTypeChange} />
            </TableRowCell>

            <TableRowCell className={styles.resolution}>
                <TextInput name="resolution" value={resolution} onChange={handleResolutionChange} />
            </TableRowCell>

            <TableRowCell className={styles.dpi}>
                <TextInput name="dpi" value={dpi} onChange={handleDpiChange} />
            </TableRowCell>

            <TableRowCell className={styles.source}>{result.source}</TableRowCell>

            <TableRowCell className={styles.rejected}>
                {result.matchRejections.length ? (
                    <Popover
                        anchor={<Icon name={icons.DANGER} kind={kinds.DANGER} />}
                        title={translate('ReleaseRejected')}
                        body={
                            <ul>
                                {result.matchRejections.map((rejection, index) => {
                                    return <li key={index}>{rejection}</li>;
                                })}
                            </ul>
                        }
                        position={tooltipPositions.LEFT}
                    />
                ) : null}
            </TableRowCell>

            <TableRowCell className={styles.download}>
                <SpinnerIconButton
                    name={getDownloadIcon(isGrabbing, isGrabbed, isError)}
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
                    kind={getDownloadKind(isTorrentGrabbed, isTorrentError)}
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
                    title={translate('OverrideAndAddToDownloadQueue')}
                    onPress={onOverridePress}
                >
                    <div className={styles.manualDownloadContent}>
                        <Icon
                            className={styles.interactiveIcon}
                            name={icons.INTERACTIVE}
                            size={12}
                        />

                        <Icon className={styles.downloadIcon} name={icons.CIRCLE_DOWN} size={10} />
                    </div>
                </Link>
            </TableRowCell>

            <ConfirmModal
                isOpen={isConfirmGrabModalOpen}
                kind={kinds.WARNING}
                title={translate('GrabRelease')}
                message={translate('GrabReleaseUnknownVolumeOrIssueMessageText', {
                    title: result.displayTitle,
                })}
                confirmLabel={translate('Grab')}
                onConfirm={onGrabConfirm}
                onCancel={onGrabCancel}
            />
        </TableRow>
    );
}
