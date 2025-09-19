// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useExecuteCommandMutation } from 'Store/Api/Command';
import { useGetVolumesQuery, useSearchVolumeQuery } from 'Store/Api/Volumes';

// Misc
import { commandNames, icons } from 'Helpers/Props';

import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// General Components
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';

// Specific Components
import DeleteVolumeModal from 'Volume/Delete/DeleteVolumeModal';
import EditVolumeModal from 'Volume/Edit/EditVolumeModal';
import VolumeIndexProgressBar from 'Volume/Index/ProgressBar';
import VolumeIndexPosterSelect from 'Volume/Index/Select/VolumeIndexPosterSelect';
import VolumePoster from 'Volume/VolumePoster';
import VolumeIndexPosterInfo from '../VolumeIndexPosterInfo';

// CSS
import styles from './index.module.css';

// Types
import type { IndexSort } from '../..';

interface VolumeIndexPosterProps {
    volumeId: number;
    sortKey: IndexSort;
    isSelectMode: boolean;
    posterWidth: number;
    posterHeight: number;
}

// IMPLEMENTATIONS

export default function VolumeIndexPoster({
    volumeId,
    isSelectMode,
    posterWidth,
    posterHeight,
    sortKey,
}: VolumeIndexPosterProps) {
    const { volumePublicInfo, refetch: refetchAllVolumes } = useGetVolumesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            volumePublicInfo: data!.find((item) => item.id === volumeId)!,
        }),
    });
    const { data: volume, refetch } = useSearchVolumeQuery({ volumeId });

    const {
        detailedProgressBar,
        showFolder,
        showMonitored,
        showSearchAction,
        showSizeOnDisk,
        showTitle,
    } = useRootSelector((state) => state.volumeIndex.posterOptions);

    const [hasPosterError, setHasPosterError] = useState(false);
    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] = useState(false);

    const [executeCommand, { isSuccess: isCmdSuccess, originalArgs, isLoading }] =
        useExecuteCommandMutation();

    const { isRefreshingVolume, isSearchingVolume } = useMemo(() => {
        const isRunning = (cmd: string) => originalArgs?.cmd === cmd && isLoading;

        return {
            isRefreshingVolume: isRunning(commandNames.REFRESH_VOLUME),
            isSearchingVolume: isRunning(commandNames.VOLUME_SEARCH),
        };
    }, [originalArgs, isLoading]);

    const onRefreshPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.REFRESH_VOLUME,
            volumeId,
        });
    }, [executeCommand, volumeId]);

    useEffect(() => {
        if (isCmdSuccess) {
            refetch();

            // Not sure why but the timeout is necessary
            // for updating the progress label
            setTimeout(() => {
                refetchAllVolumes();
            }, 1000);
        }
    }, [refetch, refetchAllVolumes, isCmdSuccess]);

    const onSearchPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.VOLUME_SEARCH,
            volumeId,
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

    const { title, monitored, folder, publisher, totalSize, volumeNumber, year } = volume;

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
                        lazy
                        onError={onPosterLoadError}
                        onLoad={onPosterLoad}
                    />

                    {hasPosterError ? <div className={styles.overlayTitle}>{title}</div> : null}
                </Link>
            </div>

            <VolumeIndexProgressBar
                volume={volumePublicInfo}
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

            {showSizeOnDisk ? (
                <div className={styles.title} title={translate('SizeOnDisk')}>
                    {formatBytes(totalSize)}
                </div>
            ) : null}

            {showFolder ? (
                <div className={styles.title} title={translate('Folder')}>
                    {folder}
                </div>
            ) : null}

            <VolumeIndexPosterInfo
                sortKey={sortKey}
                publisher={publisher}
                volumeNumber={volumeNumber}
                year={year}
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
