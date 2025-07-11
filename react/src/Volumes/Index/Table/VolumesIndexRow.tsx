/*
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSelect } from 'App/SelectContext';*/
// import { REFRESH_VOLUMES, VOLUMES_SEARCH } from 'Commands/commandNames';
/*import CheckInput from 'Components/Form/CheckInput';
import HeartRating from 'Components/HeartRating';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import VolumesTagList from 'Components/VolumesTagList';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import VirtualTableSelectCell from 'Components/Table/Cells/VirtualTableSelectCell';*/
import { type Column } from 'Components/Table/Column';
/*import { icons } from 'Helpers/Props';
import DeleteVolumesModal from 'Volumes/Delete/DeleteVolumesModal';
import EditVolumesModal from 'Volumes/Edit/EditVolumesModal';
// import createVolumesIndexItemSelector from 'Volumes/Index/createVolumesIndexItemSelector';
import { type Statistics } from 'Volumes/Volumes';
import VolumesBanner from 'Volumes/VolumesBanner';
import VolumesTitleLink from 'Volumes/VolumesTitleLink';
// import { executeCommand } from 'Store/Actions/commandActions';
import { type SelectStateInputProps } from 'typings/props';
import formatBytes from 'Utilities/Number/formatBytes';
import titleCase from 'Utilities/String/titleCase';
import translate from 'Utilities/String/translate';
import VolumesIndexProgressBar from '../ProgressBar/VolumesIndexProgressBar';
// import hasGrowableColumns from './hasGrowableColumns';
import SeasonsCell from './SeasonsCell';
// import selectTableOptions from './selectTableOptions';
import VolumesStatusCell from './VolumesStatusCell';
import styles from './VolumesIndexRow.module.css';
*/

interface VolumesIndexRowProps {
    volumesId: number;
    sortKey: string;
    columns: Column[];
    isSelectMode: boolean;
}

// @ts-expect-error TODO:
// eslint-disable-next-line
function VolumesIndexRow(props: VolumesIndexRowProps) {
    /*
    const { volumesId, columns, isSelectMode } = props;

    const { volumes, qualityProfile, latestSeason, isRefreshingVolumes, isSearchingVolumes } =
         useSelector(createVolumesIndexItemSelector(props.volumesId));

    const { showBanners, showSearchAction } = useSelector(selectTableOptions);

    const {
        title,
        monitored,
        monitorNewItems,
        status,
        path,
        titleSlug,
        nextAiring,
        previousAiring,
        added,
        statistics = {} as Statistics,
        seasonFolder,
        images,
        volumesType,
        network,
        originalLanguage,
        certification,
        year,
        useSceneNumbering,
        genres = [],
        ratings,
        seasons = [],
        tags = [],
        isSaving = false,
    } = volumes;

    const {
        seasonCount = 0,
        issueCount = 0,
        issueFileCount = 0,
        totalIssueCount = 0,
        sizeOnDisk = 0,
        releaseGroups = [],
    } = statistics;

    const dispatch = useDispatch();
    const [hasBannerError, setHasBannerError] = useState(false);
    const [isEditVolumesModalOpen, setIsEditVolumesModalOpen] = useState(false);
    const [isDeleteVolumesModalOpen, setIsDeleteVolumesModalOpen] = useState(false);
    const [selectState, selectDispatch] = useSelect();

    const onRefreshPress = useCallback(() => {
        dispatch(
            executeCommand({
                name: REFRESH_VOLUMES,
                volumesIds: [volumesId],
            }),
        );
    }, [volumesId, dispatch]);

    const onSearchPress = useCallback(() => {
        dispatch(
            executeCommand({
                name: VOLUMES_SEARCH,
                volumesId,
            }),
        );
    }, [volumesId, dispatch]);

    const onBannerLoadError = useCallback(() => {
        setHasBannerError(true);
    }, [setHasBannerError]);

    const onBannerLoad = useCallback(() => {
        setHasBannerError(false);
    }, [setHasBannerError]);

    const onEditVolumesPress = useCallback(() => {
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

    const checkInputCallback = useCallback(() => {
        // Mock handler to satisfy `onChange` being required for `CheckInput`.
    }, []);

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

    return (
        <>
            {isSelectMode ? (
                <VirtualTableSelectCell
                    id={volumesId}
                    isSelected={selectState.selectedState[volumesId]}
                    isDisabled={false}
                    onSelectedChange={onSelectedChange}
                />
            ) : null}

            {columns.map((column) => {
                const { name, isVisible } = column;

                if (!isVisible) {
                    return null;
                }

                if (name === 'status') {
                    return (
                        <VolumesStatusCell
                            key={name}
                            className={styles[name]}
                            volumesId={volumesId}
                            monitored={monitored}
                            status={status}
                            isSelectMode={isSelectMode}
                            isSaving={isSaving}
                            component={VirtualTableRowCell}
                        />
                    );
                }

                if (name === 'sortTitle') {
                    return (
                        <VirtualTableRowCell
                            key={name}
                            className={classNames(
                                styles[name],
                                showBanners && styles.banner,
                                showBanners && !hasGrowableColumns(columns) && styles.bannerGrow,
                            )}
                        >
                            {showBanners ? (
                                <Link className={styles.link} to={`/volumes/${titleSlug}`}>
                                    <VolumesBanner
                                        className={styles.bannerImage}
                                        images={images}
                                        lazy={false}
                                        // overflow={true} FIXME: see if necessary
                                        onError={onBannerLoadError}
                                        onLoad={onBannerLoad}
                                    />

                                    {hasBannerError && (
                                        <div className={styles.overlayTitle}>{title}</div>
                                    )}
                                </Link>
                            ) : (
                                <VolumesTitleLink titleSlug={titleSlug} title={title} />
                            )}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'volumesType') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {titleCase(volumesType)}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'network') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {network}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'originalLanguage') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {originalLanguage.name}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'qualityProfileId') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {qualityProfile?.name ?? ''}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'nextAiring') {
                    return (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore ts(2739)
                        <RelativeDateCell
                            key={name}
                            className={styles[name]}
                            date={nextAiring}
                            component={VirtualTableRowCell}
                        />
                    );
                }

                if (name === 'previousAiring') {
                    return (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore ts(2739)
                        <RelativeDateCell
                            key={name}
                            className={styles[name]}
                            date={previousAiring}
                            component={VirtualTableRowCell}
                        />
                    );
                }

                if (name === 'added') {
                    return (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore ts(2739)
                        <RelativeDateCell
                            key={name}
                            className={styles[name]}
                            date={added}
                            component={VirtualTableRowCell}
                        />
                    );
                }

                if (name === 'seasonCount') {
                    return (
                        <SeasonsCell
                            key={name}
                            className={styles[name]}
                            volumesId={volumesId}
                            seasonCount={seasonCount}
                            seasons={seasons}
                            isSelectMode={isSelectMode}
                        />
                    );
                }

                if (name === 'seasonFolder') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <CheckInput
                                name="seasonFolder"
                                value={seasonFolder}
                                isDisabled={true}
                                onChange={checkInputCallback}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'issueProgress') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <VolumesIndexProgressBar
                                volumesId={volumesId}
                                monitored={monitored}
                                status={status}
                                issueCount={issueCount}
                                issueFileCount={issueFileCount}
                                totalIssueCount={totalIssueCount}
                                width={125}
                                detailedProgressBar={true}
                                isStandalone={true}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'latestSeason') {
                    if (!latestSeason) {
                        return <VirtualTableRowCell key={name} className={styles[name]} />;
                    }

                    const seasonStatistics = latestSeason.statistics || {};

                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <VolumesIndexProgressBar
                                volumesId={volumesId}
                                seasonNumber={latestSeason.seasonNumber}
                                monitored={monitored}
                                status={status}
                                issueCount={seasonStatistics.issueCount}
                                issueFileCount={seasonStatistics.issueFileCount}
                                totalIssueCount={seasonStatistics.totalIssueCount}
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

                if (name === 'genres') {
                    const joinedGenres = genres.join(', ');

                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <span title={joinedGenres}>{joinedGenres}</span>
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'ratings') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <HeartRating rating={ratings.value} votes={ratings.votes} />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'certification') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {certification}
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

                if (name === 'tags') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <VolumesTagList tags={tags} />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'useSceneNumbering') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <CheckInput
                                className={styles.checkInput}
                                name="useSceneNumbering"
                                value={useSceneNumbering}
                                isDisabled={true}
                                onChange={checkInputCallback}
                            />
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'monitorNewItems') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            {monitorNewItems === 'all'
                                ? translate('SeasonsMonitoredAll')
                                : translate('SeasonsMonitoredNone')}
                        </VirtualTableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <VirtualTableRowCell key={name} className={styles[name]}>
                            <SpinnerIconButton
                                name={icons.REFRESH}
                                title={translate('RefreshVolumes')}
                                isSpinning={isRefreshingVolumes}
                                onPress={onRefreshPress}
                            />

                            {showSearchAction ? (
                                <SpinnerIconButton
                                    name={icons.SEARCH}
                                    title={translate('SearchForMonitoredIssues')}
                                    isSpinning={isSearchingVolumes}
                                    onPress={onSearchPress}
                                />
                            ) : null}

                            <IconButton
                                name={icons.EDIT}
                                title={translate('EditVolumes')}
                                onPress={onEditVolumesPress}
                            />
                        </VirtualTableRowCell>
                    );
                }

                return null;
            })}

            <EditVolumesModal
                isOpen={isEditVolumesModalOpen}
                volumesId={volumesId}
                onModalClose={onEditVolumesModalClose}
                onDeleteVolumesPress={onDeleteVolumesPress}
            />

            <DeleteVolumesModal
                isOpen={isDeleteVolumesModalOpen}
                volumesId={volumesId}
                onModalClose={onDeleteVolumesModalClose}
            />
        </>
    );
    */
    return null;
}

export default VolumesIndexRow;
