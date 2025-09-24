// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootDispatch, useRootSelector } from 'Store/createAppStore';

import { showMessage } from 'Store/Slices/Messages';
import {
    editIssueStatus,
    editVolumeStatus,
    setIsConnected,
    setIsSearchAllRunning,
    setIsUpdateAllRunning,
    setMassEditorState,
} from 'Store/Slices/SocketEvents';

import { useLazyGetQueueQuery } from 'Store/Api/Queue';

import {
    useLazyGetStatsQuery,
    useLazyGetVolumesQuery,
    useLazySearchVolumeQuery,
} from 'Store/Api/Volumes';

// Misc
import {
    commandNames,
    icons,
    massEditActions,
    socketEvents,
} from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useSocketEvents from 'Helpers/Hooks/useSocketEvents';

// Types
import type { SocketEventHandler } from 'typings/Socket';
import type { MassEditAction } from 'Helpers/Props/massEditActions';
import type { IconName } from 'Components/Icon';

// IMPLEMENTATIONS

const ACTION_MAP = {
    [massEditActions.DELETE]: { id: 50, name: icons.DELETE },
    [massEditActions.RENAME]: { id: 51, name: icons.ORGANIZE },
    [massEditActions.SEARCH]: { id: 52, name: icons.SEARCH },
    [massEditActions.UPDATE]: { id: 53, name: icons.UPDATE },
    [massEditActions.CONVERT]: { id: 54, name: icons.CONVERT },
    [massEditActions.MONITOR]: { id: 55, name: icons.MONITORED },
    [massEditActions.UNMONITOR]: { id: 56, name: icons.UNMONITORED },
    [massEditActions.REMOVE_ADS]: { id: 57, name: icons.EDIT },
    [massEditActions.ROOT_FOLDER]: { id: 58, name: icons.ROOT_FOLDER },
    [massEditActions.MONITORING_SCHEME]: { id: 58, name: icons.MONITORED },
} satisfies Record<MassEditAction, { name: IconName; id: number }>;

export default function SocketListener() {
    const dispatch = useRootDispatch();
    const { callbacks } = useRootSelector((state) => state.socketEvents);

    // Queries
    const [getAllVolumes] = useLazyGetVolumesQuery({
        selectFromResult: () => ({}),
    });
    const [getStats] = useLazyGetStatsQuery({
        selectFromResult: () => ({}),
    });
    const [fetchVolume] = useLazySearchVolumeQuery({
        selectFromResult: () => ({}),
    });
    const [fetchQueue] = useLazyGetQueueQuery({
        selectFromResult: () => ({}),
    });

    const refreshVolumeEndpoints = useCallback(
        async (volumeId: number) => {
            await fetchVolume({ volumeId });
            await getAllVolumes();
            await getStats();
        },
        [fetchVolume, getAllVolumes, getStats],
    );

    // Callbacks
    const handleConnect = useCallback<
        SocketEventHandler<typeof socketEvents.CONNECT>
    >(() => {
        dispatch(setIsConnected(true));

        callbacks.connect.forEach((callback) => {
            callback();
        });
    }, [callbacks.connect, dispatch]);

    const handleDisconnect = useCallback<
        SocketEventHandler<typeof socketEvents.DISCONNECT>
    >(() => {
        dispatch(setIsConnected(false));

        callbacks.disconnect.forEach((callback) => {
            callback();
        });
    }, [callbacks.disconnect, dispatch]);

    const handleMassEditorStatus = useCallback<
        SocketEventHandler<typeof socketEvents.MASS_EDITOR_STATUS>
    >(
        async (data) => {
            dispatch(
                setMassEditorState(data.identifier, {
                    currentItem: data.currentItem,
                    totalItems: data.totalItems,
                    isRunning: data.currentItem !== data.totalItems,
                }),
            );

            dispatch(
                showMessage({
                    ...ACTION_MAP[data.identifier],
                    type:
                        data.currentItem !== data.totalItems
                            ? 'info'
                            : 'success',
                    // Keep messages in progress opened
                    hideAfter: data.currentItem !== data.totalItems ? 0 : 3,
                    message: `${translate(data.identifier)}: ${data.currentItem} / ${data.totalItems}`,
                }),
            );

            if (data.currentItem === data.totalItems) {
                await getAllVolumes();
                await getStats();

                callbacks.mass_editor_status.forEach((callback) => {
                    callback(data);
                });
            }
            else {
                callbacks.mass_editor_status.forEach((callback) => {
                    callback(data);
                });
            }
        },
        [callbacks.mass_editor_status, dispatch, getAllVolumes, getStats],
    );

    const handleQueueAdded = useCallback<
        SocketEventHandler<typeof socketEvents.QUEUE_ADDED>
    >(
        async (data) => {
            await fetchQueue();
            await refreshVolumeEndpoints(data.volumeId);

            callbacks.queue_added.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.queue_added, fetchQueue, refreshVolumeEndpoints],
    );

    const handleQueueEnded = useCallback<
        SocketEventHandler<typeof socketEvents.QUEUE_ENDED>
    >(
        async (data) => {
            await fetchQueue();

            callbacks.queue_ended.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.queue_ended, fetchQueue],
    );

    const handleQueueStatus = useCallback<
        SocketEventHandler<typeof socketEvents.QUEUE_STATUS>
    >(
        async (data) => {
            await fetchQueue();

            callbacks.queue_status.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.queue_status, fetchQueue],
    );

    const handleDownloadedStatus = useCallback<
        SocketEventHandler<typeof socketEvents.DOWNLOADED_STATUS>
    >(
        async (data) => {
            await refreshVolumeEndpoints(data.volumeId);

            callbacks.downloaded_status.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.downloaded_status, refreshVolumeEndpoints],
    );

    const handleTaskAdded = useCallback<
        SocketEventHandler<typeof socketEvents.TASK_ADDED>
    >(
        async (data) => {
            switch (data.action) {
                case commandNames.CONVERT_VOLUME: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isConverting: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.CONVERT_ISSUE: {
                    if (data.volumeId && data.issueId) {
                        dispatch(
                            editIssueStatus({
                                volumeId: data.volumeId,
                                issueId: data.issueId,
                                status: { isConverting: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.REFRESH_VOLUME: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isRefreshing: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.RENAME_VOLUME: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isRenaming: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.RENAME_ISSUE: {
                    if (data.volumeId && data.issueId) {
                        dispatch(
                            editIssueStatus({
                                volumeId: data.volumeId,
                                issueId: data.issueId,
                                status: { isRenaming: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.VOLUME_SEARCH: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isSearching: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.ISSUE_SEARCH: {
                    if (data.volumeId && data.issueId) {
                        dispatch(
                            editIssueStatus({
                                volumeId: data.volumeId,
                                issueId: data.issueId,
                                status: { isSearching: true },
                            }),
                        );
                    }
                    break;
                }

                case commandNames.SEARCH_ALL: {
                    dispatch(setIsSearchAllRunning(true));
                    break;
                }

                case commandNames.UPDATE_ALL: {
                    dispatch(setIsUpdateAllRunning(true));
                    break;
                }
            }

            callbacks.task_added.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.task_added, dispatch],
    );

    const handleTaskEnded = useCallback<
        SocketEventHandler<typeof socketEvents.TASK_ENDED>
    >(
        async (data) => {
            switch (data.action) {
                case commandNames.CONVERT_VOLUME: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isConverting: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.CONVERT_ISSUE: {
                    if (data.volumeId && data.issueId) {
                        dispatch(
                            editIssueStatus({
                                volumeId: data.volumeId,
                                issueId: data.issueId,
                                status: { isConverting: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.REFRESH_VOLUME: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isRefreshing: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.RENAME_VOLUME: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isRenaming: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.RENAME_ISSUE: {
                    if (data.volumeId && data.issueId) {
                        dispatch(
                            editIssueStatus({
                                volumeId: data.volumeId,
                                issueId: data.issueId,
                                status: { isRenaming: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.VOLUME_SEARCH: {
                    if (data.volumeId) {
                        dispatch(
                            editVolumeStatus({
                                volumeId: data.volumeId,
                                status: { isSearching: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.ISSUE_SEARCH: {
                    if (data.volumeId && data.issueId) {
                        dispatch(
                            editIssueStatus({
                                volumeId: data.volumeId,
                                issueId: data.issueId,
                                status: { isSearching: false },
                            }),
                        );
                        if (data.volumeId) {
                            await refreshVolumeEndpoints(data.volumeId);
                        }
                    }
                    break;
                }

                case commandNames.SEARCH_ALL: {
                    await getAllVolumes();
                    await getStats();
                    dispatch(setIsSearchAllRunning(false));
                    break;
                }

                case commandNames.UPDATE_ALL: {
                    await getAllVolumes();
                    await getStats();
                    dispatch(setIsUpdateAllRunning(false));
                    break;
                }
            }

            callbacks.task_ended.forEach((callback) => {
                callback(data);
            });
        },
        [
            callbacks.task_ended,
            getAllVolumes,
            getStats,
            refreshVolumeEndpoints,
            dispatch,
        ],
    );

    const handleTaskStatus = useCallback<
        SocketEventHandler<typeof socketEvents.TASK_STATUS>
    >(
        (data) => {
            callbacks.task_status.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.task_status],
    );

    const handleIssueUpdated = useCallback<
        SocketEventHandler<typeof socketEvents.ISSUE_UPDATED>
    >(
        async (data) => {
            await fetchVolume({ volumeId: data.issue.volumeId });

            callbacks.issue_updated.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.issue_updated, fetchVolume],
    );

    const handleVolumeUpdated = useCallback<
        SocketEventHandler<typeof socketEvents.VOLUME_UPDATED>
    >(
        async (data) => {
            await refreshVolumeEndpoints(data.volume.id);

            callbacks.volume_updated.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.volume_updated, refreshVolumeEndpoints],
    );

    const handleIssueDeleted = useCallback<
        SocketEventHandler<typeof socketEvents.ISSUE_DELETED>
    >(
        async (data) => {
            await fetchVolume({ volumeId: data.volumeId });

            callbacks.issue_deleted.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.issue_deleted, fetchVolume],
    );

    const handleVolumeDeleted = useCallback<
        SocketEventHandler<typeof socketEvents.VOLUME_DELETED>
    >(
        async (data) => {
            await refreshVolumeEndpoints(data.volumeId);

            callbacks.volume_deleted.forEach((callback) => {
                callback(data);
            });
        },
        [callbacks.volume_deleted, refreshVolumeEndpoints],
    );

    // Hook
    useSocketEvents({
        connect: handleConnect,
        disconnect: handleDisconnect,

        massEditorStatus: handleMassEditorStatus,

        queueAdded: handleQueueAdded,
        queueEnded: handleQueueEnded,
        queueStatus: handleQueueStatus,
        downloadedStatus: handleDownloadedStatus,

        taskAdded: handleTaskAdded,
        taskEnded: handleTaskEnded,
        taskStatus: handleTaskStatus,

        issueUpdated: handleIssueUpdated,
        volumeUpdated: handleVolumeUpdated,

        issueDeleted: handleIssueDeleted,
        volumeDeleted: handleVolumeDeleted,
    });

    return null;
}
