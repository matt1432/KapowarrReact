import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import { icons } from 'Helpers/Props';
import DeleteVolumesModal from 'Volumes/Delete/DeleteVolumesModal';
import EditVolumesModal from 'Volumes/Edit/EditVolumesModal';
import VolumesIndexProgressBar from 'Volumes/Index/ProgressBar/VolumesIndexProgressBar';
import VolumesIndexPosterSelect from 'Volumes/Index/Select/VolumesIndexPosterSelect';
import VolumesPoster from 'Volumes/VolumesPoster';
// import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
// import formatDateTime from 'Utilities/Date/formatDateTime';
// import getRelativeDate from 'Utilities/Date/getRelativeDate';
import translate from 'Utilities/String/translate';
import VolumesIndexPosterInfo from './VolumesIndexPosterInfo';
import type { IndexSort } from '..';
import styles from './VolumesIndexPoster.module.css';
import { useSearchVolumeQuery } from 'Store/createApiEndpoints';

interface VolumesIndexPosterProps {
    volumeId: number;
    sortKey: IndexSort;
    isSelectMode: boolean;
    posterWidth: number;
    posterHeight: number;
}

function VolumesIndexPoster(props: VolumesIndexPosterProps) {
    const { volumeId, isSelectMode, posterWidth, posterHeight } = props;

    const {
        data: volume,
        isFetching: isRefreshingVolume,
        isLoading: isSearchingVolume,
    } = useSearchVolumeQuery({ volumeId });

    const { detailedProgressBar, showTitle, showMonitored, showSearchAction } = useRootSelector(
        (state) => state.volumesIndex.posterOptions,
    );

    // const { showRelativeDates, shortDateFormat, longDateFormat, timeFormat } = useSelector(
    //     createUISettingsSelector(),
    // );

    const dispatch = useRootDispatch();

    const [hasPosterError, setHasPosterError] = useState(false);
    const [isEditVolumesModalOpen, setIsEditVolumesModalOpen] = useState(false);
    const [isDeleteVolumesModalOpen, setIsDeleteVolumesModalOpen] = useState(false);

    const onRefreshPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: REFRESH_VOLUME,
                volumeIds: [volumeId],
            }),
        );
            */
    }, [volumeId, dispatch]);

    const onSearchPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: VOLUMES_SEARCH,
                volumeId,
            }),
        );
            */
    }, [volumeId, dispatch]);

    const onPosterLoadError = useCallback(() => {
        setHasPosterError(true);
    }, [setHasPosterError]);

    const onPosterLoad = useCallback(() => {
        setHasPosterError(false);
    }, [setHasPosterError]);

    const onEditVolumePress = useCallback(() => {
        setIsEditVolumesModalOpen(true);
    }, [setIsEditVolumesModalOpen]);

    const onEditVolumesModalClose = useCallback(() => {
        setIsEditVolumesModalOpen(false);
    }, [setIsEditVolumesModalOpen]);

    const onDeleteVolumesPress = useCallback(() => {
        setIsEditVolumesModalOpen(false);
        setIsDeleteVolumesModalOpen(true);
    }, [setIsDeleteVolumesModalOpen]);

    const onDeleteVolumesModalClose = useCallback(() => {
        setIsDeleteVolumesModalOpen(false);
    }, [setIsDeleteVolumesModalOpen]);

    if (!volume) {
        return null;
    }

    const status = '' as string;

    const {
        title,
        monitored,
        // status,
        // folder,
        // publisher,
        issue_count: issueCount,
        general_files: files,
        // total_size: sizeOnDisk,
    } = volume;

    const issueFileCount = files.length;

    const link = `/volumes/${volumeId}`;

    const elementStyle = {
        width: `${posterWidth}px`,
        height: `${posterHeight}px`,
    };

    return (
        <div className={styles.content}>
            <div className={styles.posterContainer} title={title}>
                {isSelectMode ? <VolumesIndexPosterSelect volumeId={volumeId} /> : null}

                <Label className={styles.controls}>
                    <SpinnerIconButton
                        className={styles.action}
                        name={icons.REFRESH}
                        title={translate('RefreshVolume')}
                        isSpinning={isRefreshingVolume}
                        onPress={onRefreshPress}
                    />

                    {showSearchAction ? (
                        <SpinnerIconButton
                            className={styles.action}
                            name={icons.SEARCH}
                            title={translate('SearchForMonitoredIssues')}
                            isSpinning={isSearchingVolume}
                            onPress={onSearchPress}
                        />
                    ) : null}

                    <IconButton
                        className={styles.action}
                        name={icons.EDIT}
                        title={translate('EditVolume')}
                        onPress={onEditVolumePress}
                    />
                </Label>

                {status === 'ended' ? (
                    <div
                        className={classNames(styles.status, styles.ended)}
                        title={translate('Ended')}
                    />
                ) : null}

                {status === 'deleted' ? (
                    <div
                        className={classNames(styles.status, styles.deleted)}
                        title={translate('Deleted')}
                    />
                ) : null}

                <Link className={styles.link} style={elementStyle} to={link}>
                    <VolumesPoster
                        volume={volume}
                        style={elementStyle}
                        size={250}
                        lazy={false}
                        // overflow={true} FIXME: see if necessary
                        onError={onPosterLoadError}
                        onLoad={onPosterLoad}
                    />

                    {hasPosterError ? <div className={styles.overlayTitle}>{title}</div> : null}
                </Link>
            </div>

            <VolumesIndexProgressBar
                volumeId={volumeId}
                monitored={monitored}
                status={status}
                issueCount={issueCount}
                issueFileCount={issueFileCount}
                width={posterWidth}
                detailedProgressBar={detailedProgressBar}
                isStandalone={false}
            />

            {showTitle ? (
                <div className={styles.title} title={title}>
                    {title}
                </div>
            ) : null}

            {showMonitored ? (
                <div className={styles.title}>
                    {monitored ? translate('Monitored') : translate('Unmonitored')}
                </div>
            ) : null}

            <VolumesIndexPosterInfo
            // sizeOnDisk={sizeOnDisk}
            // showRelativeDates={showRelativeDates}
            // sortKey={sortKey}
            // shortDateFormat={shortDateFormat}
            // longDateFormat={longDateFormat}
            // timeFormat={timeFormat}
            />

            <EditVolumesModal
                isOpen={isEditVolumesModalOpen}
                volumeId={volumeId}
                onModalClose={onEditVolumesModalClose}
                onDeleteVolumesPress={onDeleteVolumesPress}
            />

            <DeleteVolumesModal
                isOpen={isDeleteVolumesModalOpen}
                volumeId={volumeId}
                onModalClose={onDeleteVolumesModalClose}
            />
        </div>
    );
}

export default VolumesIndexPoster;
