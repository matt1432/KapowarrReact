/*import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// FIXME: find a replacement for react 19
// import TextTruncate from 'react-text-truncate';
// import { REFRESH_VOLUMES, VOLUMES_SEARCH } from 'Commands/commandNames';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import VolumeTagList from 'Components/VolumeTagList';
import { icons } from 'Helpers/Props';
import DeleteVolumeModal from 'Volume/Delete/DeleteVolumeModal';
import EditVolumeModal from 'Volume/Edit/EditVolumeModal';
import VolumeIndexProgressBar from 'Volume/Index/ProgressBar/VolumeIndexProgressBar';
import VolumeIndexPosterSelect from 'Volume/Index/Select/VolumeIndexPosterSelect';
import { type Statistics } from 'Volume/Volume';
import VolumePoster from 'Volume/VolumePoster';
// import { executeCommand } from 'Store/Actions/commandActions';*/
// import dimensions from 'Styles/Variables/dimensions';
// import fonts from 'Styles/Variables/fonts';
/*import translate from 'Utilities/String/translate';
// import createVolumeIndexItemSelector from '../createVolumeIndexItemSelector';
// import selectOverviewOptions from './selectOverviewOptions';
import VolumeIndexOverviewInfo from './VolumeIndexOverviewInfo';
import styles from './VolumeIndexOverview.module.css';

const columnPadding = parseInt(dimensions.volumeIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(dimensions.volumeIndexColumnPaddingSmallScreen);
// const defaultFontSize = parseInt(fonts.defaultFontSize);
// const lineHeight = parseFloat(fonts.lineHeight);

// Hardcoded height based on line-height of 32 + bottom margin of 10.
// Less side-effecty than using react-measure.
const TITLE_HEIGHT = 42;*/

interface VolumeIndexOverviewProps {
    volumeId: number;
    sortKey: string;
    posterWidth: number;
    posterHeight: number;
    rowHeight: number;
    isSelectMode: boolean;
    isSmallScreen: boolean;
}

// @ts-expect-error TODO:
// eslint-disable-next-line
function VolumeIndexOverview(props: VolumeIndexOverviewProps) {
    /*
    const {
        volumeId,
        sortKey,
        posterWidth,
        posterHeight,
        rowHeight,
        isSelectMode,
        isSmallScreen,
    } = props;

    const { volume, qualityProfile, isRefreshingVolume, isSearchingVolume } = useSelector(
        createVolumeIndexItemSelector(props.volumeId),
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
    } = volume;

    const {
        seasonCount = 0,
        issueCount = 0,
        issueFileCount = 0,
        totalIssueCount = 0,
        sizeOnDisk = 0,
    } = statistics;

    const dispatch = useDispatch();
    const [isEditVolumeModalOpen, setIsEditVolumeModalOpen] = useState(false);
    const [isDeleteVolumeModalOpen, setIsDeleteVolumeModalOpen] = useState(false);

    const onRefreshPress = useCallback(() => {
        dispatch(
            executeCommand({
                name: REFRESH_VOLUMES,
                volumeIds: [volumeId],
            }),
        );
    }, [volumeId, dispatch]);

    const onSearchPress = useCallback(() => {
        dispatch(
            executeCommand({
                name: VOLUMES_SEARCH,
                volumeId,
            }),
        );
    }, [volumeId, dispatch]);

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
                        {isSelectMode ? <VolumeIndexPosterSelect volumeId={volumeId} /> : null}

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
                            <VolumePoster
                                className={styles.poster}
                                style={elementStyle}
                                images={images}
                                size={250}
                                lazy={false}
                            />
                        </Link>
                    </div>

                    <VolumeIndexProgressBar
                        volumeId={volumeId}
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
                                title={translate('RefreshVolume')}
                                isSpinning={isRefreshingVolume}
                                onPress={onRefreshPress}
                            />

                            {overviewOptions.showSearchAction ? (
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
                                    <VolumeTagList tags={tags} />
                                </div>
                            ) : null}
                        </div>
                        <VolumeIndexOverviewInfo
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
        */
    return null;
}

export default VolumeIndexOverview;
