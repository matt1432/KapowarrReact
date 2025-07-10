/*import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { REFRESH_VOLUMES, VOLUMES_SEARCH } from 'Commands/commandNames';
import Label from 'Components/Label';
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
// import { executeCommand } from 'Store/Actions/commandActions';
// import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import formatDateTime from 'Utilities/Date/formatDateTime';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import translate from 'Utilities/String/translate';
import createVolumesIndexItemSelector from '../createVolumesIndexItemSelector';
import selectPosterOptions from './selectPosterOptions';
import VolumesIndexPosterInfo from './VolumesIndexPosterInfo';
import styles from './VolumesIndexPoster.module.css';
*/

interface VolumesIndexPosterProps {
    volumesId: number;
    sortKey: string;
    isSelectMode: boolean;
    posterWidth: number;
    posterHeight: number;
}

function VolumesIndexPoster(props: VolumesIndexPosterProps) {
    console.log(props);
    /*
    const { volumesId, sortKey, isSelectMode, posterWidth, posterHeight } = props;

    const { volumes, qualityProfile, isRefreshingVolumes, isSearchingVolumes } = useSelector(
        createVolumesIndexItemSelector(props.volumesId),
    );

    const {
        detailedProgressBar,
        showTitle,
        showMonitored,
        showQualityProfile,
        showTags,
        showSearchAction,
    } = useSelector(selectPosterOptions);

    const { showRelativeDates, shortDateFormat, longDateFormat, timeFormat } = useSelector(
        createUISettingsSelector(),
    );

    const {
        title,
        monitored,
        status,
        path,
        titleSlug,
        originalLanguage,
        network,
        nextAiring,
        previousAiring,
        added,
        statistics = {} as Statistics,
        images,
        tags,
    } = volumes;

    const {
        seasonCount = 0,
        issueCount = 0,
        issueFileCount = 0,
        totalIssueCount = 0,
        sizeOnDisk = 0,
    } = statistics;

    const dispatch = useDispatch();
    const [hasPosterError, setHasPosterError] = useState(false);
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

    const onPosterLoadError = useCallback(() => {
        setHasPosterError(true);
    }, [setHasPosterError]);

    const onPosterLoad = useCallback(() => {
        setHasPosterError(false);
    }, [setHasPosterError]);

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

    return (
        <div className={styles.content}>
            <div className={styles.posterContainer} title={title}>
                {isSelectMode ? <VolumesIndexPosterSelect volumesId={volumesId} /> : null}

                <Label className={styles.controls}>
                    <SpinnerIconButton
                        className={styles.action}
                        name={icons.REFRESH}
                        title={translate('RefreshVolumes')}
                        isSpinning={isRefreshingVolumes}
                        onPress={onRefreshPress}
                    />

                    {showSearchAction ? (
                        <SpinnerIconButton
                            className={styles.action}
                            name={icons.SEARCH}
                            title={translate('SearchForMonitoredIssues')}
                            isSpinning={isSearchingVolumes}
                            onPress={onSearchPress}
                        />
                    ) : null}

                    <IconButton
                        className={styles.action}
                        name={icons.EDIT}
                        title={translate('EditVolumes')}
                        onPress={onEditVolumesPress}
                    />
                </Label>

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
                        style={elementStyle}
                        images={images}
                        size={250}
                        lazy={false}
                        // overflow={true} FIXME: see if necessary
                        onError={onPosterLoadError}
                        onLoad={onPosterLoad}
                    />

                    {hasPosterError ? <div className={styles.overlayTitle}>{title}</div> : null}
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

            {showQualityProfile && !!qualityProfile?.name ? (
                <div className={styles.title} title={translate('QualityProfile')}>
                    {qualityProfile.name}
                </div>
            ) : null}

            {nextAiring ? (
                <div
                    className={styles.nextAiring}
                    title={`${translate('NextAiring')}: ${formatDateTime(
                        nextAiring,
                        longDateFormat,
                        timeFormat,
                    )}`}
                >
                    {getRelativeDate({
                        date: nextAiring,
                        shortDateFormat,
                        showRelativeDates,
                        timeFormat,
                        timeForToday: true,
                    })}
                </div>
            ) : null}

            {showTags && tags.length ? (
                <div className={styles.tags}>
                    <div className={styles.tagsList}>
                        <VolumesTagList tags={tags} />
                    </div>
                </div>
            ) : null}

            <VolumesIndexPosterInfo
                originalLanguage={originalLanguage}
                network={network}
                previousAiring={previousAiring}
                added={added}
                seasonCount={seasonCount}
                sizeOnDisk={sizeOnDisk}
                path={path}
                qualityProfile={qualityProfile}
                showQualityProfile={showQualityProfile}
                showRelativeDates={showRelativeDates}
                sortKey={sortKey}
                shortDateFormat={shortDateFormat}
                longDateFormat={longDateFormat}
                timeFormat={timeFormat}
                tags={tags}
                showTags={showTags}
            />

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

export default VolumesIndexPoster;
