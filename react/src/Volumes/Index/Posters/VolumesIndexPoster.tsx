import { useCallback, useState } from 'react';
import { useRootSelector } from 'Store/createAppStore';
import { useExecuteCommandMutation, useSearchVolumeQuery } from 'Store/createApiEndpoints';
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
import translate from 'Utilities/String/translate';
import VolumesIndexPosterInfo from './VolumesIndexPosterInfo';
import type { IndexSort } from '..';
import styles from './VolumesIndexPoster.module.css';

interface VolumesIndexPosterProps {
    volumeId: number;
    sortKey: IndexSort;
    isSelectMode: boolean;
    posterWidth: number;
    posterHeight: number;
}

function VolumesIndexPoster(props: VolumesIndexPosterProps) {
    const { volumeId, isSelectMode, posterWidth, posterHeight, sortKey } = props;

    const {
        data: volume,
        isFetching: isRefreshingVolume,
        isLoading: isSearchingVolume,
    } = useSearchVolumeQuery({ volumeId });

    const { detailedProgressBar, showTitle, showMonitored, showSearchAction } = useRootSelector(
        (state) => state.volumesIndex.posterOptions,
    );

    const [hasPosterError, setHasPosterError] = useState(false);
    const [isEditVolumesModalOpen, setIsEditVolumesModalOpen] = useState(false);
    const [isDeleteVolumesModalOpen, setIsDeleteVolumesModalOpen] = useState(false);

    const [executeCommand] = useExecuteCommandMutation();

    const onRefreshPress = useCallback(() => {
        executeCommand({
            cmd: 'refresh_and_scan',
            volume_id: volumeId.toString(),
        });
    }, [executeCommand, volumeId]);

    const onSearchPress = useCallback(() => {
        executeCommand({
            cmd: 'auto_search',
            volume_id: volumeId.toString(),
        });
    }, [executeCommand, volumeId]);

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

    const {
        title,
        monitored,
        folder,
        publisher,
        issues,
        issues_downloaded: issueFileCount,
        total_size: sizeOnDisk,
    } = volume;

    const issueCount = issues.filter((issue) => issue.monitored).length;

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

                <Link className={styles.link} style={elementStyle} to={link}>
                    <VolumesPoster
                        volume={volume}
                        style={elementStyle}
                        size={250}
                        lazy={false}
                        onError={onPosterLoadError}
                        onLoad={onPosterLoad}
                    />

                    {hasPosterError ? <div className={styles.overlayTitle}>{title}</div> : null}
                </Link>
            </div>

            <VolumesIndexProgressBar
                volumeId={volumeId}
                monitored={monitored}
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
                sortKey={sortKey}
                sizeOnDisk={sizeOnDisk}
                publisher={publisher}
                folder={folder}
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
