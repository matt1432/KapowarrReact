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

// CSS
import styles from './index.module.css';

// Types
import type { InteractiveSearchPayload, SearchResult } from 'typings/Search';

interface InteractiveSearchRowProps {
    searchPayload: InteractiveSearchPayload;
    result: SearchResult;
}

// IMPLEMENTATIONS

function getDownloadIcon(isGrabbing: boolean, isGrabbed: boolean, isError: boolean) {
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

export default function InteractiveSearchRow({ searchPayload, result }: InteractiveSearchRowProps) {
    const [
        grabRelease,
        { isLoading: isGrabbing, isSuccess: isGrabbed, isError, error: grabError },
    ] = useAddDownloadMutation();

    const onGrabPress = useCallback(
        (forceMatch = false) => {
            grabRelease({
                ...searchPayload,
                result,
                forceMatch,
            });
        },
        [grabRelease, result, searchPayload],
    );

    const [isConfirmGrabModalOpen, setIsConfirmGrabModalOpen] = useState(false);

    const onGrabPressWrapper = useCallback(() => {
        if (result.matchRejections.length === 0) {
            onGrabPress();

            return;
        }

        setIsConfirmGrabModalOpen(true);
    }, [onGrabPress, result.matchRejections]);

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

    // TODO: allow editing values before grabbing release

    return (
        <TableRow>
            <TableRowCell className={styles.match}>
                <Icon
                    name={result.match ? icons.CHECK : icons.CHECK_SQUARE}
                    className={styles.matchIcon}
                />
            </TableRowCell>

            <TableRowCell className={styles.issueNumber}>{result.issueNumber}</TableRowCell>

            <TableRowCell className={styles.displayTitle}>{result.displayTitle}</TableRowCell>

            <TableRowCell className={styles.filesize}>{formatBytes(result.filesize)}</TableRowCell>

            <TableRowCell className={styles.pages}>{result.pages}</TableRowCell>

            <TableRowCell className={styles.releaser}>{result.releaser}</TableRowCell>

            <TableRowCell className={styles.scanType}>{result.scanType}</TableRowCell>

            <TableRowCell className={styles.resolution}>{result.resolution}</TableRowCell>

            <TableRowCell className={styles.dpi}>{result.dpi}</TableRowCell>

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
