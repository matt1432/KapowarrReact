// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import {
    useExecuteCommandMutation,
    useFetchQueueDetails,
    useGetVolumesQuery,
    useSearchVolumeQuery,
    useToggleVolumeMonitoredMutation,
} from 'Store/createApiEndpoints';

// Misc
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { icons, kinds, sizes, /*sortDirections,*/ tooltipPositions } from 'Helpers/Props';

import usePrevious from 'Helpers/Hooks/usePrevious';
import sortByProp from 'Utilities/Array/sortByProp';
import translate from 'Utilities/String/translate';
import formatBytes from 'Utilities/Number/formatBytes';

// General Components
import Alert from 'Components/Alert';
import Icon from 'Components/Icon';
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
import Tooltip from 'Components/Tooltip/Tooltip';

// Specific Components
import DeleteVolumeModal from 'Volume/Delete/DeleteVolumeModal';
import EditVolumeModal from 'Volume/Edit/EditVolumeModal';
import VolumePoster from 'Volume/VolumePoster';

import IssueTable from './IssueTable';
import VolumeDetailsLinks from './VolumeDetailsLinks';
import VolumeProgressLabel from './VolumeProgressLabel';

// CSS
import styles from './VolumeDetails.module.css';

// Types
interface VolumeDetailsProps {
    volumeId: number;
}

// IMPLEMENTATIONS

// TODO:
// import InteractiveImportModal from 'InteractiveImport/InteractiveImportModal';
// import OrganizePreviewModal from 'Organize/OrganizePreviewModal';
// import MonitoringOptionsModal from 'Volume/MonitoringOptions/MonitoringOptionsModal';

function useIssuesSelector(volumeId: number) {
    const { error, issues, isFetching, isUninitialized, refetch } = useSearchVolumeQuery(
        { volumeId },
        {
            selectFromResult: ({ data, ...rest }) => ({
                issues: data?.issues ?? [],
                ...rest,
            }),
        },
    );

    const hasIssues = Boolean(issues.length);
    const hasMonitoredIssues = issues.some((e) => e.monitored);

    return {
        isFetching,
        isPopulated: !isUninitialized,
        issuesError: error,
        hasIssues,
        hasMonitoredIssues,
        refetchIssues: refetch,
    };
}

function VolumeDetails({ volumeId }: VolumeDetailsProps) {
    const { data: volume } = useSearchVolumeQuery({ volumeId });
    const { data: allVolumes } = useGetVolumesQuery();

    const { isFetching, isPopulated, issuesError, hasIssues, hasMonitoredIssues, refetchIssues } =
        useIssuesSelector(volumeId);

    const [executeCommand, executeCommandState] = useExecuteCommandMutation();
    const [toggleVolumeMonitored] = useToggleVolumeMonitoredMutation();
    const { refetch: refetchQueueDetails } = useFetchQueueDetails(volumeId);

    const { isRefreshing, isRenaming, isSearching } = useMemo(() => {
        const isRunning = (cmd: string) =>
            executeCommandState.originalArgs?.cmd === cmd &&
            executeCommandState.originalArgs?.volumeId === volumeId.toString();

        return {
            isRefreshing: isRunning('refresh_and_scan'),
            isRenaming: isRunning(`/volumes/${volumeId}/rename`),
            isSearching: isRunning('auto_search'),
        };
    }, [volumeId, executeCommandState]);

    const { nextVolume, previousVolume } = useMemo(() => {
        const sortedVolume = [...(allVolumes ?? [])].sort(sortByProp('title'));
        const volumeIndex = sortedVolume.findIndex((volume) => volume.id === volumeId);

        if (volumeIndex === -1) {
            return {
                nextVolume: undefined,
                previousVolume: undefined,
            };
        }

        const nextVolume = sortedVolume[volumeIndex + 1] ?? sortedVolume[0];
        const previousVolume =
            sortedVolume[volumeIndex - 1] ?? sortedVolume[sortedVolume.length - 1];

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

    // const [isOrganizeModalOpen, setIsOrganizeModalOpen] = useState(false);
    // const [isManageIssuesOpen, setIsManageIssuesOpen] = useState(false);
    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] = useState(false);
    // const [isMonitorOptionsModalOpen, setIsMonitorOptionsModalOpen] = useState(false);
    const wasRefreshing = usePrevious(isRefreshing);
    const wasRenaming = usePrevious(isRenaming);

    const handleOrganizePress = useCallback(() => {
        // setIsOrganizeModalOpen(true);
    }, []);

    /*
    const handleOrganizeModalClose = useCallback(() => {
        setIsOrganizeModalOpen(false);
    }, []);
    */

    const handleManageIssuesPress = useCallback(() => {
        // setIsManageIssuesOpen(true);
    }, []);

    /*
    const handleManageIssuesModalClose = useCallback(() => {
        setIsManageIssuesOpen(false);
    }, []);
    */

    const handleEditVolumePress = useCallback(() => {
        setIsEditVolumeModalOpen(true);
    }, []);

    const handleEditVolumeModalClose = useCallback(() => {
        setIsEditVolumeModalOpen(false);
    }, []);

    const handleDeleteVolumePress = useCallback(() => {
        setIsEditVolumeModalOpen(false);
        setIsDeleteVolumeModalOpen(true);
    }, []);

    const handleDeleteVolumeModalClose = useCallback(() => {
        setIsDeleteVolumeModalOpen(false);
    }, []);

    const handleMonitorOptionsPress = useCallback(() => {
        // setIsMonitorOptionsModalOpen(true);
    }, []);

    /*
    const handleMonitorOptionsClose = useCallback(() => {
        setIsMonitorOptionsModalOpen(false);
    }, []);
    */

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
            cmd: 'refresh_and_scan',
            volumeId: volumeId.toString(),
        });
    }, [volumeId, executeCommand]);

    const handleSearchPress = useCallback(() => {
        executeCommand({
            cmd: 'auto_search',
            volumeId: volumeId.toString(),
        });
    }, [volumeId, executeCommand]);

    const populate = useCallback(() => {
        refetchIssues();
        refetchQueueDetails();
    }, [refetchIssues, refetchQueueDetails]);

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

    const {
        title,
        folder,
        monitored,
        publisher,
        site_url,
        description,
        issue_count: issueCount,
        issues_downloaded: issueFileCount,
        total_size: sizeOnDisk,
    } = volume;

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

                    <PageToolbarSeparator />

                    <PageToolbarButton
                        label={translate('PreviewRename')}
                        iconName={icons.ORGANIZE}
                        isDisabled={issueFileCount === 0}
                        onPress={handleOrganizePress}
                    />

                    <PageToolbarButton
                        label={translate('ManageIssues')}
                        iconName={icons.ISSUE_FILE}
                        onPress={handleManageIssuesPress}
                    />

                    <PageToolbarSeparator />

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
                                            isSaving={false} // TODO:
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
                                                    {formatBytes(sizeOnDisk)}
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
                                    tooltip={<VolumeDetailsLinks site_url={site_url} />}
                                    kind={kinds.INVERSE}
                                    position={tooltipPositions.BOTTOM}
                                />

                                <VolumeProgressLabel
                                    className={styles.volumeProgressLabel}
                                    volumeId={volumeId}
                                    monitored={monitored}
                                    issueCount={issueCount}
                                    issueFileCount={issueFileCount}
                                />
                            </div>

                            <div className={styles.overview}>
                                {parse(
                                    DOMPurify.sanitize(description, {
                                        USE_PROFILES: { html: true },
                                    }),
                                )}
                            </div>

                            <MetadataAttribution />
                        </div>
                    </div>
                </div>

                <div className={styles.contentContainer}>
                    {!isPopulated && !issuesError ? <LoadingIndicator /> : null}

                    {!isFetching && issuesError ? (
                        <Alert kind={kinds.DANGER}>{translate('IssuesLoadError')}</Alert>
                    ) : null}

                    {!isFetching ? (
                        <Alert kind={kinds.DANGER}>{translate('IssueFilesLoadError')}</Alert>
                    ) : null}

                    <IssueTable volumeId={volumeId} />
                </div>

                {/*
                <OrganizePreviewModal
                    isOpen={isOrganizeModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleOrganizeModalClose}
                />

                <InteractiveImportModal
                    isOpen={isManageIssuesOpen}
                    volumeId={volumeId}
                    title={title}
                    folder={folder}
                    initialSortKey="relativePath"
                    initialSortDirection={sortDirections.DESCENDING}
                    showVolume={false}
                    allowVolumeChange={false}
                    showDelete={true}
                    showImportMode={false}
                    modalTitle={translate('ManageIssues')}
                    onModalClose={handleManageIssuesModalClose}
                />
                */}

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

                {/*
                <MonitoringOptionsModal
                    isOpen={isMonitorOptionsModalOpen}
                    volumeId={volumeId}
                    onModalClose={handleMonitorOptionsClose}
                />
                */}
            </PageContentBody>
        </PageContent>
    );
}

export default VolumeDetails;
