import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextTruncate from 'react-text-truncate';
// import { REFRESH_COMICS, COMICS_SEARCH } from 'Commands/commandNames';
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
import dimensions from 'Styles/Variables/dimensions';
import fonts from 'Styles/Variables/fonts';
import translate from 'Utilities/String/translate';
import createComicsIndexItemSelector from '../createComicsIndexItemSelector';
import selectOverviewOptions from './selectOverviewOptions';
import ComicsIndexOverviewInfo from './ComicsIndexOverviewInfo';
import styles from './ComicsIndexOverview.module.css';

const columnPadding = parseInt(dimensions.comicsIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(dimensions.comicsIndexColumnPaddingSmallScreen);
const defaultFontSize = parseInt(fonts.defaultFontSize);
const lineHeight = parseFloat(fonts.lineHeight);

// Hardcoded height based on line-height of 32 + bottom margin of 10.
// Less side-effecty than using react-measure.
const TITLE_HEIGHT = 42;

interface ComicsIndexOverviewProps {
    comicsId: number;
    sortKey: string;
    posterWidth: number;
    posterHeight: number;
    rowHeight: number;
    isSelectMode: boolean;
    isSmallScreen: boolean;
}

function ComicsIndexOverview(props: ComicsIndexOverviewProps) {
    const { comicsId, sortKey, posterWidth, posterHeight, rowHeight, isSelectMode, isSmallScreen } =
        props;

    const { comics, qualityProfile, isRefreshingComics, isSearchingComics } = useSelector(
        createComicsIndexItemSelector(props.comicsId),
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
    } = comics;

    const {
        seasonCount = 0,
        issueCount = 0,
        issueFileCount = 0,
        totalIssueCount = 0,
        sizeOnDisk = 0,
    } = statistics;

    const dispatch = useDispatch();
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
                        {isSelectMode ? <ComicsIndexPosterSelect comicsId={comicsId} /> : null}

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
                                className={styles.poster}
                                style={elementStyle}
                                images={images}
                                size={250}
                                lazy={false}
                                overflow={true}
                            />
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
                                title={translate('RefreshComics')}
                                isSpinning={isRefreshingComics}
                                onPress={onRefreshPress}
                            />

                            {overviewOptions.showSearchAction ? (
                                <SpinnerIconButton
                                    name={icons.SEARCH}
                                    title={translate('SearchForMonitoredIssues')}
                                    isSpinning={isSearchingComics}
                                    onPress={onSearchPress}
                                />
                            ) : null}

                            <IconButton
                                name={icons.EDIT}
                                title={translate('EditComics')}
                                onPress={onEditComicsPress}
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
                            </Link>

                            {overviewOptions.showTags ? (
                                <div className={styles.tags}>
                                    <ComicsTagList tags={tags} />
                                </div>
                            ) : null}
                        </div>
                        <ComicsIndexOverviewInfo
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

export default ComicsIndexOverview;
