/*import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// FIXME: find a replacement for react 19
// import TextTruncate from 'react-text-truncate';
// import { REFRESH_VOLUMES, VOLUMES_SEARCH } from 'Commands/commandNames';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import VolumesTagList from 'Components/VolumesTagList';
import { icons } from 'Helpers/Props';
import DeleteVolumesModal from 'Volumes/Delete/DeleteVolumesModal';
import EditVolumesModal from 'Volumes/Edit/EditVolumesModal';
import VolumesIndexProgressBar from 'Volumes/Index/ProgressBar/VolumesIndexProgressBar';
import VolumesIndexPosterSelect from 'Volumes/Index/Select/VolumesIndexPosterSelect';
import { type Statistics } from 'Volumes/Volumes';
import VolumesPoster from 'Volumes/VolumesPoster';
// import { executeCommand } from 'Store/Actions/commandActions';*/
// import dimensions from 'Styles/Variables/dimensions';
// import fonts from 'Styles/Variables/fonts';
/*import translate from 'Utilities/String/translate';
// import createVolumesIndexItemSelector from '../createVolumesIndexItemSelector';
// import selectOverviewOptions from './selectOverviewOptions';
import VolumesIndexOverviewInfo from './VolumesIndexOverviewInfo';
import styles from './VolumesIndexOverview.module.css';

const columnPadding = parseInt(dimensions.volumesIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(dimensions.volumesIndexColumnPaddingSmallScreen);
// const defaultFontSize = parseInt(fonts.defaultFontSize);
// const lineHeight = parseFloat(fonts.lineHeight);

// Hardcoded height based on line-height of 32 + bottom margin of 10.
// Less side-effecty than using react-measure.
const TITLE_HEIGHT = 42;*/

interface VolumesIndexOverviewProps {
    volumesId: number;
    sortKey: string;
    posterWidth: number;
    posterHeight: number;
    rowHeight: number;
    isSelectMode: boolean;
    isSmallScreen: boolean;
}

// @ts-expect-error TODO:
// eslint-disable-next-line
function VolumesIndexOverview(props: VolumesIndexOverviewProps) {
    /*
    const {
        volumesId,
        sortKey,
        posterWidth,
        posterHeight,
        rowHeight,
        isSelectMode,
        isSmallScreen,
    } = props;

    const { volumes, qualityProfile, isRefreshingVolumes, isSearchingVolumes } = useSelector(
        createVolumesIndexItemSelector(props.volumesId),
    );

    const overviewOptions = useSelector(selectOverviewOptions);

    const {
        title,
        monitored,
        status,
        path,
        titleSlug,
        nextAiring,
        previousAiring,
        added,
        overview,
        statistics = {} as Statistics,
        images,
        tags,
        network,
    } = volumes;

    const {
        seasonCount = 0,
        issueCount = 0,
        issueFileCount = 0,
        totalIssueCount = 0,
        sizeOnDisk = 0,
    } = statistics;

    const dispatch = useDispatch();
    const [isEditVolumesModalOpen, setIsEditVolumesModalOpen] = useState(false);
    const [isDeleteVolumesModalOpen, setIsDeleteVolumesModalOpen] = useState(false);

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

    const link = `/volumes/${titleSlug}`;

    const elementStyle = {
        width: `${posterWidth}px`,
        height: `${posterHeight}px`,
    };

    const contentHeight = useMemo(() => {
        const padding = isSmallScreen ? columnPaddingSmallScreen : columnPadding;

        return rowHeight - padding;
    }, [rowHeight, isSmallScreen]);

    const overviewHeight = contentHeight - TITLE_HEIGHT;

    return (
        <div>
            <div className={styles.content}>
                <div className={styles.poster}>
                    <div className={styles.posterContainer}>
                        {isSelectMode ? <VolumesIndexPosterSelect volumesId={volumesId} /> : null}

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
                                className={styles.poster}
                                style={elementStyle}
                                images={images}
                                size={250}
                                lazy={false}
                            />
                        </Link>
                    </div>

                    <VolumesIndexProgressBar
                        volumesId={volumesId}
                        monitored={monitored}
                        status={status}
                        issueCount={issueCount}
                        issueFileCount={issueFileCount}
                        totalIssueCount={totalIssueCount}
                        width={posterWidth}
                        detailedProgressBar={overviewOptions.detailedProgressBar}
                        isStandalone={false}
                    />
                </div>

                <div className={styles.info} style={{ maxHeight: contentHeight }}>
                    <div className={styles.titleRow}>
                        <Link className={styles.title} to={link}>
                            {title}
                        </Link>

                        <div className={styles.actions}>
                            <SpinnerIconButton
                                name={icons.REFRESH}
                                title={translate('RefreshVolumes')}
                                isSpinning={isRefreshingVolumes}
                                onPress={onRefreshPress}
                            />

                            {overviewOptions.showSearchAction ? (
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
                        </div>
                    </div>

                    <div className={styles.details}>
                        <div className={styles.overviewContainer}>
                            <Link className={styles.overview} to={link}>
                                <TextTruncate
                                    line={Math.floor(
                                        overviewHeight / (defaultFontSize * lineHeight),
                                    )}
                                    text={overview}
                                />
                                {overview}
                            </Link>

                            {overviewOptions.showTags ? (
                                <div className={styles.tags}>
                                    <VolumesTagList tags={tags} />
                                </div>
                            ) : null}
                        </div>
                        <VolumesIndexOverviewInfo
                            height={overviewHeight}
                            monitored={monitored}
                            network={network}
                            nextAiring={nextAiring}
                            previousAiring={previousAiring}
                            added={added}
                            seasonCount={seasonCount}
                            qualityProfile={qualityProfile}
                            sizeOnDisk={sizeOnDisk}
                            path={path}
                            sortKey={sortKey}
                            {...overviewOptions}
                        />
                    </div>
                </div>
            </div>

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
        </div>
    );
        */
    return null;
}

export default VolumesIndexOverview;
