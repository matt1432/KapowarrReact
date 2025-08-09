// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useExecuteCommandMutation, useSearchVolumeQuery } from 'Store/createApiEndpoints';

// Misc
import { commandNames, icons } from 'Helpers/Props';
import { useSelect } from 'App/SelectContext';

import classNames from 'classnames';
import formatBytes from 'Utilities/Number/formatBytes';
import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
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
import type { SelectStateInputProps } from 'typings/props';
import type { VolumeColumnName } from 'Volume/Volume';

interface VolumeIndexRowProps {
    volumeId: number;
    sortKey: string;
    columns: Column<VolumeColumnName>[];
    isSelectMode: boolean;
}

// IMPLEMENTATIONS

function VolumeIndexRow({ volumeId, columns, isSelectMode }: VolumeIndexRowProps) {
    const { data: volume } = useSearchVolumeQuery({ volumeId });

    const { showSearchAction } = useRootSelector((state) => state.volumeIndex.tableOptions);

    const [executeCommand, executeCommandState] = useExecuteCommandMutation();

    const { isRefreshingVolume, isSearchingVolume } = useMemo(() => {
        const isRunning = (cmd: string) =>
            executeCommandState.originalArgs?.cmd === cmd && executeCommandState.isLoading;

        return {
            isRefreshingVolume: isRunning(commandNames.REFRESH_VOLUME),
            isSearchingVolume: isRunning(commandNames.VOLUME_SEARCH),
        };
    }, [executeCommandState]);

    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] = useState(false);
    const [selectState, selectDispatch] = useSelect();

    const onRefreshPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.REFRESH_VOLUME,
            volumeId,
        });
    }, [executeCommand, volumeId]);

    const onSearchPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.VOLUME_SEARCH,
            volumeId,
        });
    }, [executeCommand, volumeId]);

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

    const {
        title,
        monitorNewIssues: monitorNewItems,
        folder: path,
        id: titleSlug,
        specialVersion,
        publisher,
        year,
        totalSize: sizeOnDisk,
        issues,
    } = volume;

    const totalIssueCount = issues.length;

    const releaseGroups = issues
        .map((is) => is.files.map((f) => f.releaser ?? ''))
        .flat()
        .filter((r) => r !== '');

    return (
        <>
            {isSelectMode ? (
                <VirtualTableSelectCell
                    id={volumeId}
                    isSelected={selectState.selectedState[volumeId]}
                    isDisabled={false}
                    onSelectedChange={onSelectedChange}
                />
            ) : null}

            {columns.map((column) => {
                const { name, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'title') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={classNames(styles[name as keyof typeof styles])}
                        >
                            <VolumeTitleLink titleSlug={titleSlug.toString()} title={title} />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'specialVersion') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {titleCase(specialVersion ?? '')}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'publisher') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={styles[name as keyof typeof styles]}
                        >
                            {publisher}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'issueProgress') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <VolumeIndexProgressBar
                                volume={volume!}
                                width={125}
                                detailedProgressBar={true}
                                isStandalone={true}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'issueCount') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {totalIssueCount}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'year') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {year}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'path') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {path}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'sizeOnDisk') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {formatBytes(sizeOnDisk)}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'releaseGroups') {
                    const joinedReleaseGroups = releaseGroups.join(', ');
                    const truncatedReleaseGroups =
                        releaseGroups.length > 3
                            ? `${releaseGroups.slice(0, 3).join(', ')}...`
                            : joinedReleaseGroups;

                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <span title={joinedReleaseGroups}>{truncatedReleaseGroups}</span>
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'monitorNewItems') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {monitorNewItems
                                ? translate('MonitorFutureIssues')
                                : translate('MonitorNoFutureIssues')}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <SpinnerIconButton
                                name={icons.REFRESH}
                                title={translate('RefreshVolume')}
                                isSpinning={isRefreshingVolume}
                                onPress={onRefreshPress}
                            />

                            {showSearchAction ? (
                                <SpinnerIconButton
                                    name={icons.SEARCH}
                                    title={translate('SearchForMonitoredIssues')}
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
                volumeId={volumeId}
                onModalClose={onEditVolumeModalClose}
                onDeleteVolumePress={onDeleteVolumePress}
            />

            <DeleteVolumeModal
                isOpen={isDeleteVolumeModalOpen}
                volumeId={volumeId}
                onModalClose={onDeleteVolumeModalClose}
            />
        </>
    );
}

export default VolumeIndexRow;
