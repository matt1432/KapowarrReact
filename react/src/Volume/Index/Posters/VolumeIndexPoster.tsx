// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useExecuteCommandMutation, useSearchVolumeQuery } from 'Store/createApiEndpoints';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';

// Specific Components
import DeleteVolumeModal from 'Volume/Delete/DeleteVolumeModal';
import EditVolumeModal from 'Volume/Edit/EditVolumeModal';
import VolumeIndexProgressBar from 'Volume/Index/ProgressBar/VolumeIndexProgressBar';
import VolumeIndexPosterSelect from 'Volume/Index/Select/VolumeIndexPosterSelect';
import VolumePoster from 'Volume/VolumePoster';
import VolumeIndexPosterInfo from './VolumeIndexPosterInfo';

// CSS
import styles from './VolumeIndexPoster.module.css';

// Types
import type { IndexSort } from '..';

interface VolumeIndexPosterProps {
    volumeId: number;
    sortKey: IndexSort;
    isSelectMode: boolean;
    posterWidth: number;
    posterHeight: number;
}

// IMPLEMENTATIONS

function VolumeIndexPoster(props: VolumeIndexPosterProps) {
    const { volumeId, isSelectMode, posterWidth, posterHeight, sortKey } = props;

    const {
        data: volume,
        isFetching: isRefreshingVolume,
        isLoading: isSearchingVolume,
    } = useSearchVolumeQuery({ volumeId });

    const { detailedProgressBar, showTitle, showMonitored, showSearchAction } = useRootSelector(
        (state) => state.volumeIndex.posterOptions,
    );

    const [hasPosterError, setHasPosterError] = useState(false);
    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] = useState(false);

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
        setIsEditVolumeModalOpen(true);
    }, [setIsEditVolumeModalOpen]);

    const onEditVolumeModalClose = useCallback(() => {
        setIsEditVolumeModalOpen(false);
    }, [setIsEditVolumeModalOpen]);

    const onDeleteVolumePress = useCallback(() => {
        setIsEditVolumeModalOpen(false);
        setIsDeleteVolumeModalOpen(true);
    }, [setIsDeleteVolumeModalOpen]);

    const onDeleteVolumeModalClose = useCallback(() => {
        setIsDeleteVolumeModalOpen(false);
    }, [setIsDeleteVolumeModalOpen]);

    if (!volume) {
        return null;
    }

    const { title, monitored, folder, publisher, total_size: sizeOnDisk } = volume;

    const link = `/volumes/${volumeId}`;

    const elementStyle = {
        width: `${posterWidth}px`,
        height: `${posterHeight}px`,
    };

    return (
        <div className={styles.content}>
            <div className={styles.posterContainer} title={title}>
                {isSelectMode ? <VolumeIndexPosterSelect volumeId={volumeId} /> : null}

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
                    <VolumePoster
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

            <VolumeIndexProgressBar
                volume={volume}
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

            <VolumeIndexPosterInfo
                sortKey={sortKey}
                sizeOnDisk={sizeOnDisk}
                publisher={publisher}
                folder={folder}
            />

            <EditVolumeModal
                isOpen={isEditVolumeModalOpen}
                volumeId={volumeId}
                onModalClose={onEditVolumeModalClose}
                onDeleteVolumePress={onDeleteVolumePress}
            />

            <DeleteVolumeModal
                isOpen={isDeleteVolumeModalOpen}
                volumeId={volumeId}
                onModalClose={onDeleteVolumeModalClose}
            />
        </div>
    );
}

export default VolumeIndexPoster;
