import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { REFRESH_COMICS, COMICS_SEARCH } from 'Commands/commandNames';
import Label from 'Components/Label';
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import ComicsTagList from 'Components/ComicsTagList';
import { icons } from 'Helpers/Props';
import DeleteComicsModal from 'Comics/Delete/DeleteComicsModal';
import EditComicsModal from 'Comics/Edit/EditComicsModal';
import ComicsIndexProgressBar from 'Comics/Index/ProgressBar/ComicsIndexProgressBar';
import ComicsIndexPosterSelect from 'Comics/Index/Select/ComicsIndexPosterSelect';
import { type Statistics } from 'Comics/Comics';
import ComicsPoster from 'Comics/ComicsPoster';
// import { executeCommand } from 'Store/Actions/commandActions';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import formatDateTime from 'Utilities/Date/formatDateTime';
import getRelativeDate from 'Utilities/Date/getRelativeDate';
import translate from 'Utilities/String/translate';
import createComicsIndexItemSelector from '../createComicsIndexItemSelector';
import selectPosterOptions from './selectPosterOptions';
import ComicsIndexPosterInfo from './ComicsIndexPosterInfo';
import styles from './ComicsIndexPoster.module.css';

interface ComicsIndexPosterProps {
    comicsId: number;
    sortKey: string;
    isSelectMode: boolean;
    posterWidth: number;
    posterHeight: number;
}

function ComicsIndexPoster(props: ComicsIndexPosterProps) {
    const { comicsId, sortKey, isSelectMode, posterWidth, posterHeight } = props;

    const { comics, qualityProfile, isRefreshingComics, isSearchingComics } = useSelector(
        createComicsIndexItemSelector(props.comicsId),
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
    } = comics;

    const {
        seasonCount = 0,
        issueCount = 0,
        issueFileCount = 0,
        totalIssueCount = 0,
        sizeOnDisk = 0,
    } = statistics;

    const dispatch = useDispatch();
    const [hasPosterError, setHasPosterError] = useState(false);
    const [isEditComicsModalOpen, setIsEditComicsModalOpen] = useState(false);
    const [isDeleteComicsModalOpen, setIsDeleteComicsModalOpen] = useState(false);

    const onRefreshPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: REFRESH_COMICS,
                comicsIds: [comicsId],
            }),
        );*/
    }, [comicsId, dispatch]);

    const onSearchPress = useCallback(() => {
        /*
        dispatch(
            executeCommand({
                name: COMICS_SEARCH,
                comicsId,
            }),
        );*/
    }, [comicsId, dispatch]);

    const onPosterLoadError = useCallback(() => {
        setHasPosterError(true);
    }, [setHasPosterError]);

    const onPosterLoad = useCallback(() => {
        setHasPosterError(false);
    }, [setHasPosterError]);

    const onEditComicsPress = useCallback(() => {
        setIsEditComicsModalOpen(true);
    }, [setIsEditComicsModalOpen]);

    const onEditComicsModalClose = useCallback(() => {
        setIsEditComicsModalOpen(false);
    }, [setIsEditComicsModalOpen]);

    const onDeleteComicsPress = useCallback(() => {
        setIsEditComicsModalOpen(false);
        setIsDeleteComicsModalOpen(true);
    }, [setIsDeleteComicsModalOpen]);

    const onDeleteComicsModalClose = useCallback(() => {
        setIsDeleteComicsModalOpen(false);
    }, [setIsDeleteComicsModalOpen]);

    const link = `/comics/${titleSlug}`;

    const elementStyle = {
        width: `${posterWidth}px`,
        height: `${posterHeight}px`,
    };

    return (
        <div className={styles.content}>
            <div className={styles.posterContainer} title={title}>
                {isSelectMode ? <ComicsIndexPosterSelect comicsId={comicsId} /> : null}

                <Label className={styles.controls}>
                    <SpinnerIconButton
                        className={styles.action}
                        name={icons.REFRESH}
                        title={translate('RefreshComics')}
                        isSpinning={isRefreshingComics}
                        onPress={onRefreshPress}
                    />

                    {showSearchAction ? (
                        <SpinnerIconButton
                            className={styles.action}
                            name={icons.SEARCH}
                            title={translate('SearchForMonitoredIssues')}
                            isSpinning={isSearchingComics}
                            onPress={onSearchPress}
                        />
                    ) : null}

                    <IconButton
                        className={styles.action}
                        name={icons.EDIT}
                        title={translate('EditComics')}
                        onPress={onEditComicsPress}
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
                    <ComicsPoster
                        style={elementStyle}
                        images={images}
                        size={250}
                        lazy={false}
                        overflow={true}
                        onError={onPosterLoadError}
                        onLoad={onPosterLoad}
                    />

                    {hasPosterError ? <div className={styles.overlayTitle}>{title}</div> : null}
                </Link>
            </div>

            <ComicsIndexProgressBar
                comicsId={comicsId}
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
                        <ComicsTagList tags={tags} />
                    </div>
                </div>
            ) : null}

            <ComicsIndexPosterInfo
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

            <EditComicsModal
                isOpen={isEditComicsModalOpen}
                comicsId={comicsId}
                onModalClose={onEditComicsModalClose}
                onDeleteComicsPress={onDeleteComicsPress}
            />

            <DeleteComicsModal
                isOpen={isDeleteComicsModalOpen}
                comicsId={comicsId}
                onModalClose={onDeleteComicsModalClose}
            />
        </div>
    );
}

export default ComicsIndexPoster;
