// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { getVolumeStatus } from 'Store/Slices/SocketEvents';

import { useExecuteCommandMutation } from 'Store/Api/Command';
import { useUpdateVolumeMutation } from 'Store/Api/Volumes';

// Misc
import { commandNames, icons, socketEvents } from 'Helpers/Props';
import { useSelect } from 'App/SelectContext';

import classNames from 'classnames';
import formatBytes from 'Utilities/Number/formatBytes';
import translate from 'Utilities/String/translate';

// Hooks
import useSocketCallback from 'Helpers/Hooks/useSocketCallback';

// General Components
import IconButton from 'Components/Link/IconButton';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import VirtualTableSelectCell from 'Components/Table/Cells/VirtualTableSelectCell';

// Specific Components
import DeleteVolumeModal from 'Volume/Delete/DeleteVolumeModal';
import EditVolumeModal from 'Volume/Edit/EditVolumeModal';
import VolumeTitleLink from 'Volume/VolumeTitleLink';

import VolumeIndexProgressBar from '../../ProgressBar';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { SelectStateInputProps } from 'typings/Inputs';
import type { VolumeColumnName, VolumePublicInfo } from 'Volume/Volume';
import type { SocketEventHandler } from 'typings/Socket';

interface VolumeIndexRowProps {
    volume: VolumePublicInfo;
    sortKey: string;
    columns: Column<VolumeColumnName>[];
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

export default function VolumeIndexRow({
    volume,
    columns,
    isSelectMode,
}: VolumeIndexRowProps) {
    const calledFrom = useMemo(() => `VolumeIndexRow${volume.id}`, [volume.id]);

    const { isRefreshing: isRefreshingVolume, isSearching: isSearchingVolume } =
        useRootSelector((state) => getVolumeStatus(state, volume.id));

    const { showSearchAction } = useRootSelector(
        (state) => state.volumeIndex.tableOptions,
    );

    const [executeCommand] = useExecuteCommandMutation();

    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] =
        useState(false);
    const [selectState, selectDispatch] = useSelect();

    const onRefreshPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.REFRESH_VOLUME,
            volumeId: volume.id,
        });
    }, [executeCommand, volume.id]);

    const onSearchPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.VOLUME_SEARCH,
            volumeId: volume.id,
        });
    }, [executeCommand, volume.id]);

    const [toggleMonitored] = useUpdateVolumeMutation();

    const [isToggling, setIsToggling] = useState(false);

    const socketCallback = useCallback<
        SocketEventHandler<typeof socketEvents.VOLUME_UPDATED>
    >(
        (data) => {
            if (data.calledFrom === calledFrom) {
                setIsToggling(false);
            }
        },
        [calledFrom],
    );
    useSocketCallback(socketEvents.VOLUME_UPDATED, socketCallback);

    const handleMonitorTogglePress = useCallback(
        (value: boolean) => {
            setIsToggling(true);
            toggleMonitored({
                volumeId: volume.id,
                monitored: value,
                calledFrom,
            });
        },
        [calledFrom, volume.id, toggleMonitored],
    );

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

    const onSelectedChange = useCallback(
        ({ id, value, shiftKey }: SelectStateInputProps) => {
            selectDispatch({
                type: 'toggleSelected',
                id,
                isSelected: value,
                shiftKey,
            });
        },
        [selectDispatch],
    );

    if (!volume) {
        return null;
    }

    return (
        <>
            {isSelectMode ? (
                <VirtualTableSelectCell
                    id={volume.id}
                    isSelected={selectState.selectedState[volume.id]}
                    isDisabled={false}
                    onSelectedChange={onSelectedChange}
                />
            ) : null}

            {columns.map((column) => {
                const { name, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'monitored') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles.monitored}
                        >
                            <MonitorToggleButton
                                monitored={volume.monitored}
                                isSaving={isToggling}
                                onPress={handleMonitorTogglePress}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'title') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={classNames(styles[name])}
                        >
                            <VolumeTitleLink
                                titleSlug={volume.id.toString()}
                                title={volume.title}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'publisher') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            {volume.publisher}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'issuesDownloadedMonitored') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            <VolumeIndexProgressBar
                                volume={volume}
                                width={125}
                                detailedProgressBar={true}
                                isStandalone={true}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'issueCountMonitored') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            {volume.issueCountMonitored}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'year') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            {volume.year}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'folder') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            {volume.folder}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'totalSize') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            {formatBytes(volume.totalSize)}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'monitorNewIssues') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            {volume.monitorNewIssues
                                ? translate('MonitorFutureIssues')
                                : translate('MonitorNoFutureIssues')}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name]}
                        >
                            <SpinnerIconButton
                                name={icons.REFRESH}
                                title={translate('RefreshVolume')}
                                isSpinning={isRefreshingVolume}
                                onPress={onRefreshPress}
                            />

                            {showSearchAction ? (
                                <SpinnerIconButton
                                    name={icons.SEARCH}
                                    title={translate(
                                        'SearchForMonitoredIssues',
                                    )}
                                    isSpinning={isSearchingVolume}
                                    onPress={onSearchPress}
                                />
                            ) : null}

                            <IconButton
                                name={icons.EDIT}
                                title={translate('EditVolume')}
                                onPress={onEditVolumePress}
                            />
                        </VirtualTableRowCell>
                    );
                }

                return null;
            })}

            <EditVolumeModal
                isOpen={isEditVolumeModalOpen}
                volumeId={volume.id}
                onModalClose={onEditVolumeModalClose}
                onDeleteVolumePress={onDeleteVolumePress}
            />

            <DeleteVolumeModal
                isOpen={isDeleteVolumeModalOpen}
                volumeId={volume.id}
                onModalClose={onDeleteVolumeModalClose}
            />
        </>
    );
}
