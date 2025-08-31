// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useExecuteCommandMutation } from 'Store/Api/Command';
import { useFetchQueueDetails } from 'Store/Api/Queue';
import { useGetVolumesQuery, useUpdateVolumeMutation } from 'Store/Api/Volumes';

import useVolume from 'Volume/useVolume';

// Misc
import {
    commandNames,
    icons,
    kinds,
    scrollDirections,
    sizes,
    tooltipPositions,
} from 'Helpers/Props';

import usePrevious from 'Helpers/Hooks/usePrevious';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import formatBytes from 'Utilities/Number/formatBytes';

// General Components
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
import InnerHTML from 'Components/InnerHTML';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import MetadataAttribution from 'Components/MetadataAttribution';
import MonitorToggleButton from 'Components/MonitorToggleButton';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import Scroller from 'Components/Scroller/Scroller';
import Tooltip from 'Components/Tooltip/Tooltip';

// Specific Components
import DeleteVolumeModal from 'Volume/Delete/DeleteVolumeModal';
import EditVolumeModal from 'Volume/Edit/EditVolumeModal';
import OrganizePreviewModal from 'Organize/OrganizePreviewModal';
import MonitoringOptionsModal from 'Volume/MonitoringOptions/MonitoringOptionsModal';
import SearchVolumeModal from 'Volume/Search/SearchVolumeModal';

import IssueTable from '../IssueTable';
import VolumeDetailsLinks from '../VolumeDetailsLinks';
import VolumeProgressLabel from '../VolumeProgressLabel';
import VolumePoster from 'Volume/VolumePoster';

// CSS
import styles from './index.module.css';

// Types
interface VolumeDetailsProps {
    volumeId: number;
}

// IMPLEMENTATIONS

function VolumeDetails({ volumeId }: VolumeDetailsProps) {
    const { data: allVolumes = [] } = useGetVolumesQuery();

    const { volume, refetch, isFetching, isPopulated, error, hasIssues, hasMonitoredIssues } =
        useVolume(volumeId);

    const [executeCommand, executeCommandState] = useExecuteCommandMutation();

    const [toggleVolumeMonitored, toggleVolumeMonitoredState] = useUpdateVolumeMutation();

    useEffect(() => {
        if (toggleVolumeMonitoredState.isSuccess) {
            refetch();
        }
    }, [refetch, toggleVolumeMonitoredState.isSuccess]);

    const { refetch: refetchQueueDetails } = useFetchQueueDetails({ volumeId });

    const { isRefreshing, isRenaming, isSearching } = useMemo(() => {
        const isRunning = (cmd: string) =>
            executeCommandState.originalArgs?.cmd === cmd && executeCommandState.isLoading;

        return {
            isRefreshing: isRunning(commandNames.REFRESH_VOLUME),
            isRenaming: isRunning(`/volumes/${volumeId}/rename`),
            isSearching: isRunning(commandNames.VOLUME_SEARCH),
        };
    }, [volumeId, executeCommandState]);

    const { nextVolume, previousVolume } = useMemo(() => {
        const sortedVolume = allVolumes.toSorted(sortByProp('title'));
        const volumeIndex = sortedVolume.findIndex((volume) => volume.id === volumeId);

        if (volumeIndex === -1) {
            return {
                nextVolume: undefined,
                previousVolume: undefined,
            };
        }

        const nextVolume = sortedVolume[volumeIndex + 1] ?? sortedVolume[0];
        const previousVolume = sortedVolume[volumeIndex - 1] ?? sortedVolume.at(-1)!;

        return {
            nextVolume: {
                title: nextVolume.title,
                titleSlug: nextVolume.id,
            },
            previousVolume: {
                title: previousVolume.title,
                titleSlug: previousVolume.id,
            },
        };
    }, [volumeId, allVolumes]);

    const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] = useState(false);
    const [isMonitorOptionsModalOpen, setIsMonitorOptionsModalOpen] = useState(false);
    const [isSearchVolumeModalOpen, setIsSearchVolumeModalOpen] = useState(false);

    const wasRefreshing = usePrevious(isRefreshing);
    const wasRenaming = usePrevious(isRenaming);

    const handleOrganizePress = useCallback(() => {
        setIsOrganizeModalOpen(true);
    }, []);

    const handleOrganizeModalClose = useCallback(() => {
        setIsOrganizeModalOpen(false);
    }, []);

    const handleEditVolumePress = useCallback(() => {
        setIsEditVolumeModalOpen(true);
    }, []);

    const handleEditVolumeModalClose = useCallback(() => {
        setIsEditVolumeModalOpen(false);
    }, []);

    const handleSearchVolumePress = useCallback(() => {
        setIsSearchVolumeModalOpen(true);
    }, []);

    const handleSearchVolumeModalClose = useCallback(() => {
        setIsSearchVolumeModalOpen(false);
    }, []);

    const handleDeleteVolumePress = useCallback(() => {
        setIsEditVolumeModalOpen(false);
        setIsDeleteVolumeModalOpen(true);
    }, []);

    const handleDeleteVolumeModalClose = useCallback(() => {
        setIsDeleteVolumeModalOpen(false);
    }, []);

    const handleMonitorOptionsPress = useCallback(() => {
        setIsMonitorOptionsModalOpen(true);
    }, []);

    const handleMonitorOptionsClose = useCallback(() => {
        setIsMonitorOptionsModalOpen(false);
    }, []);

    const handleMonitorTogglePress = useCallback(
        (value: boolean) => {
            toggleVolumeMonitored({
                volumeId,
                monitored: value,
            });
        },
        [volumeId, toggleVolumeMonitored],
    );

    const handleRefreshPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.REFRESH_VOLUME,
            volumeId,
        });
    }, [volumeId, executeCommand]);

    const handleSearchPress = useCallback(() => {
        executeCommand({
            cmd: commandNames.VOLUME_SEARCH,
            volumeId,
        });
    }, [volumeId, executeCommand]);

    const populate = useCallback(() => {
        refetch();
        refetchQueueDetails();
    }, [refetch, refetchQueueDetails]);

    useEffect(() => {
        populate();
    }, [populate]);

    useEffect(() => {
        if ((!isRefreshing && wasRefreshing) || (!isRenaming && wasRenaming)) {
            populate();
        }
    }, [isRefreshing, wasRefreshing, isRenaming, wasRenaming, populate]);

    if (!volume) {
        return null;
    }

    const { title, folder, monitored, publisher, siteUrl, description, issueFileCount, totalSize } =
        volume;

    let issueFilesCountMessage = translate('VolumeDetailsNoIssueFiles');

    if (issueFileCount === 1) {
        issueFilesCountMessage = translate('VolumeDetailsOneIssueFile');
    }
    else if (issueFileCount > 1) {
        issueFilesCountMessage = translate('VolumeDetailsCountIssueFiles', {
            issueFileCount,
        });
    }

    return (
        <PageContent title={title}>
            <PageToolbar>
                <PageToolbarSection>
                    <PageToolbarButton
                        label={translate('RefreshAndScan')}
                        iconName={icons.REFRESH}
                        spinningName={icons.REFRESH}
                        title={translate('RefreshAndScanTooltip')}
                        isSpinning={isRefreshing}
                        onPress={handleRefreshPress}
                    />

                    <PageToolbarButton
                        label={translate('SearchMonitored')}
                        iconName={icons.SEARCH}
                        isDisabled={!monitored || !hasMonitoredIssues || !hasIssues}
                        isSpinning={isSearching}
                        title={hasMonitoredIssues ? undefined : translate('NoMonitoredIssues')}
                        onPress={handleSearchPress}
                    />

                    <PageToolbarButton
                        label={translate('InteractiveSearch')}
                        iconName={icons.INTERACTIVE}
                        isDisabled={!monitored || !hasMonitoredIssues || !hasIssues}
                        isSpinning={false}
                        title={hasMonitoredIssues ? undefined : translate('NoMonitoredIssues')}
                        onPress={handleSearchVolumePress}
                    />

                    <PageToolbarSeparator />

                    <PageToolbarButton
                        label={translate('PreviewRename')}
                        iconName={icons.ORGANIZE}
                        isDisabled={issueFileCount === 0}
                        onPress={handleOrganizePress}
                    />

                    {/* TODO: add PreviewConvert button */}

                    <PageToolbarSeparator />

                    {/* TODO: add GeneralFiles button */}

                    <PageToolbarButton
                        label={translate('IssueMonitoring')}
                        iconName={icons.MONITORED}
                        onPress={handleMonitorOptionsPress}
                    />

                    <PageToolbarButton
                        label={translate('Edit')}
                        iconName={icons.EDIT}
                        onPress={handleEditVolumePress}
                    />

                    <PageToolbarButton
                        label={translate('Delete')}
                        iconName={icons.DELETE}
                        onPress={handleDeleteVolumePress}
                    />
                </PageToolbarSection>
            </PageToolbar>

            <PageContentBody innerClassName={styles.innerContentBody}>
                <div className={styles.header}>
                    <div className={styles.backdrop}>
                        <div className={styles.backdropOverlay} />
                    </div>

                    <div className={styles.headerContent}>
                        <VolumePoster
                            volume={volume}
                            className={styles.poster}
                            size={500}
                            lazy={false}
                        />

                        <div className={styles.info}>
                            <div className={styles.titleRow}>
                                <div className={styles.titleContainer}>
                                    <div className={styles.toggleMonitoredContainer}>
                                        <MonitorToggleButton
                                            className={styles.monitorToggleButton}
                                            monitored={monitored}
                                            isSaving={toggleVolumeMonitoredState.isLoading}
                                            size={40}
                                            onPress={handleMonitorTogglePress}
                                        />
                                    </div>

                                    <div className={styles.title}>{title}</div>
                                </div>

                                <div className={styles.volumeNavigationButtons}>
                                    {previousVolume ? (
                                        <IconButton
                                            className={styles.volumeNavigationButton}
                                            name={icons.ARROW_LEFT}
                                            size={30}
                                            title={translate('VolumeDetailsGoTo', {
                                                title: previousVolume.title,
                                            })}
                                            to={`/volumes/${previousVolume.titleSlug}`}
                                        />
                                    ) : null}

                                    {nextVolume ? (
                                        <IconButton
                                            className={styles.volumeNavigationButton}
                                            name={icons.ARROW_RIGHT}
                                            size={30}
                                            title={translate('VolumeDetailsGoTo', {
                                                title: nextVolume.title,
                                            })}
                                            to={`/volumes/${nextVolume.titleSlug}`}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <Label className={styles.detailsLabel} size={sizes.LARGE}>
                                    <div>
                                        <Icon name={icons.FOLDER} size={17} />
                                        <span className={styles.path}>{folder}</span>
                                    </div>
                                </Label>

                                <Tooltip
                                    anchor={
                                        <Label className={styles.detailsLabel} size={sizes.LARGE}>
                                            <div>
                                                <Icon name={icons.DRIVE} size={17} />

                                                <span className={styles.sizeOnDisk}>
                                                    {formatBytes(totalSize)}
                                                </span>
                                            </div>
                                        </Label>
                                    }
                                    tooltip={<span>{issueFilesCountMessage}</span>}
                                    kind={kinds.INVERSE}
                                    position={tooltipPositions.BOTTOM}
                                />

                                <Label className={styles.detailsLabel} size={sizes.LARGE}>
                                    <div>
                                        <Icon
                                            name={monitored ? icons.MONITORED : icons.UNMONITORED}
                                            size={17}
                                        />
                                        <span className={styles.qualityProfileName}>
                                            {monitored
                                                ? translate('Monitored')
                                                : translate('Unmonitored')}
                                        </span>
                                    </div>
                                </Label>

                                {publisher ? (
                                    <Label
                                        className={styles.detailsLabel}
                                        title={translate('Publisher')}
                                        size={sizes.LARGE}
                                    >
                                        <div>
                                            <Icon name={icons.PUBLISHER} size={17} />
                                            <span className={styles.network}>{publisher}</span>
                                        </div>
                                    </Label>
                                ) : null}

                                <Tooltip
                                    anchor={
                                        <Label className={styles.detailsLabel} size={sizes.LARGE}>
                                            <div>
                                                <Icon name={icons.EXTERNAL_LINK} size={17} />
                                                <span className={styles.links}>
                                                    {translate('Links')}
                                                </span>
                                            </div>
                                        </Label>
                                    }
                                    tooltip={<VolumeDetailsLinks siteUrl={siteUrl} />}
                                    kind={kinds.INVERSE}
                                    position={tooltipPositions.BOTTOM}
                                />

                                <VolumeProgressLabel
                                    className={styles.volumeProgressLabel}
                                    volume={volume}
                                />
                            </div>

                            <Scroller
                                className={styles.overview}
                                scrollDirection={scrollDirections.VERTICAL}
                                autoFocus={false}
                            >
                                <InnerHTML innerHTML={description} />
                            </Scroller>

                            <MetadataAttribution />
                        </div>
                    </div>
                </div>

                <div className={styles.contentContainer}>
                    {!isPopulated && !error ? <LoadingIndicator /> : null}

                    {!isFetching && error ? (
                        <Alert kind={kinds.DANGER}>{translate('IssuesLoadError')}</Alert>
                    ) : null}

                    <IssueTable volumeId={volumeId} />
                </div>

                <OrganizePreviewModal
                    isOpen={isOrganizeModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleOrganizeModalClose}
                />

                <EditVolumeModal
                    isOpen={isEditVolumeModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleEditVolumeModalClose}
                    onDeleteVolumePress={handleDeleteVolumePress}
                />

                <DeleteVolumeModal
                    isOpen={isDeleteVolumeModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleDeleteVolumeModalClose}
                />

                <MonitoringOptionsModal
                    isOpen={isMonitorOptionsModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleMonitorOptionsClose}
                    refetch={refetch}
                />

                <SearchVolumeModal
                    isOpen={isSearchVolumeModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleSearchVolumeModalClose}
                />
            </PageContentBody>
        </PageContent>
    );
}

export default VolumeDetails;
