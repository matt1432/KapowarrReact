import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectProvider } from 'App/SelectContext';
import { type ClientSideCollectionAppState } from 'App/State/ClientSideCollectionAppState';
import { type ComicsAppState, type ComicsIndexAppState } from 'App/State/ComicsAppState';
import Alert from 'Components/Alert';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import PageJumpBar, { type PageJumpBarItems } from 'Components/Page/PageJumpBar';
import PageToolbar from 'Components/Page/Toolbar/PageToolbar';
import PageToolbarButton from 'Components/Page/Toolbar/PageToolbarButton';
import PageToolbarSection from 'Components/Page/Toolbar/PageToolbarSection';
import PageToolbarSeparator from 'Components/Page/Toolbar/PageToolbarSeparator';
import TableOptionsModalWrapper from 'Components/Table/TableOptions/TableOptionsModalWrapper';
import withScrollPosition from 'Components/withScrollPosition';
import { align, icons, kinds } from 'Helpers/Props';
import { DESCENDING, type SortDirection } from 'Helpers/Props/sortDirections';
import ParseToolbarButton from 'Parse/ParseToolbarButton';
import NoComics from 'Comics/NoComics';
// TODO:
// import { fetchQueueDetails } from 'Store/Actions/queueActions';
// import { fetchComics } from 'Store/Actions/comicsActions';
/*import {
    setComicsFilter,
    setComicsSort,
    setComicsTableOption,
    setComicsView,
} from 'Store/Actions/comicsIndexActions';*/
import scrollPositions from 'Store/scrollPositions';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import createComicsClientSideCollectionItemsSelector from 'Store/Selectors/createComicsClientSideCollectionItemsSelector';
import translate from 'Utilities/String/translate';
import ComicsIndexFilterMenu from './Menus/ComicsIndexFilterMenu';
import ComicsIndexSortMenu from './Menus/ComicsIndexSortMenu';
import ComicsIndexViewMenu from './Menus/ComicsIndexViewMenu';
import ComicsIndexOverviewOptionsModal from './Overview/Options/ComicsIndexOverviewOptionsModal';
import ComicsIndexOverviews from './Overview/ComicsIndexOverviews';
import ComicsIndexPosterOptionsModal from './Posters/Options/ComicsIndexPosterOptionsModal';
import ComicsIndexPosters from './Posters/ComicsIndexPosters';
import ComicsIndexSelectAllButton from './Select/ComicsIndexSelectAllButton';
import ComicsIndexSelectAllMenuItem from './Select/ComicsIndexSelectAllMenuItem';
import ComicsIndexSelectFooter from './Select/ComicsIndexSelectFooter';
import ComicsIndexSelectModeButton from './Select/ComicsIndexSelectModeButton';
import ComicsIndexSelectModeMenuItem from './Select/ComicsIndexSelectModeMenuItem';
import ComicsIndexFooter from './ComicsIndexFooter';
import ComicsIndexRefreshComicsButton from './ComicsIndexRefreshComicsButton';
import ComicsIndexTable from './Table/ComicsIndexTable';
import ComicsIndexTableOptions from './Table/ComicsIndexTableOptions';
import styles from './ComicsIndex.module.css';

function getViewComponent(view: string) {
    if (view === 'posters') {
        return ComicsIndexPosters;
    }

    if (view === 'overview') {
        return ComicsIndexOverviews;
    }

    return ComicsIndexTable;
}

interface ComicsIndexProps {
    initialScrollTop?: number;
}

const ComicsIndex = withScrollPosition((props: ComicsIndexProps) => {
    // @ts-expect-error TODO:
    const {
        isFetching,
        isPopulated,
        error,
        totalItems,
        items,
        columns,
        selectedFilterKey,
        filters,
        customFilters,
        sortKey,
        sortDirection,
        view,
    }: ComicsAppState & ComicsIndexAppState & ClientSideCollectionAppState = useSelector(
        createComicsClientSideCollectionItemsSelector('comicsIndex'),
    );

    const { isSmallScreen } = useSelector(createDimensionsSelector());
    const dispatch = useDispatch();
    const scrollerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [jumpToCharacter, setJumpToCharacter] = useState<string | undefined>(undefined);
    const [isSelectMode, setIsSelectMode] = useState(false);

    useEffect(() => {
        // dispatch(fetchComics());
        // dispatch(fetchQueueDetails({ all: true }));
    }, [dispatch]);

    const onSelectModePress = useCallback(() => {
        setIsSelectMode(!isSelectMode);
    }, [isSelectMode, setIsSelectMode]);

    const onTableOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: unknown) => {
            // dispatch(setComicsTableOption(payload));
        },
        [dispatch],
    );

    const onViewSelect = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (value: string) => {
            // dispatch(setComicsView({ view: value }));

            if (scrollerRef.current) {
                scrollerRef.current.scrollTo(0, 0);
            }
        },
        [scrollerRef, dispatch],
    );

    const onSortSelect = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (value: string) => {
            // dispatch(setComicsSort({ sortKey: value }));
        },
        [dispatch],
    );

    const onFilterSelect = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (value: string | number) => {
            // dispatch(setComicsFilter({ selectedFilterKey: value }));
        },
        [dispatch],
    );

    const onOptionsPress = useCallback(() => {
        setIsOptionsModalOpen(true);
    }, [setIsOptionsModalOpen]);

    const onOptionsModalClose = useCallback(() => {
        setIsOptionsModalOpen(false);
    }, [setIsOptionsModalOpen]);

    const onJumpBarItemPress = useCallback(
        (character: string) => {
            setJumpToCharacter(character);
        },
        [setJumpToCharacter],
    );

    const onScroll = useCallback(
        ({ scrollTop }: { scrollTop: number }) => {
            setJumpToCharacter(undefined);
            scrollPositions.comicsIndex = scrollTop;
        },
        [setJumpToCharacter],
    );

    const jumpBarItems: PageJumpBarItems = useMemo(() => {
        // Reset if not sorting by sortTitle
        if (sortKey !== 'sortTitle') {
            return {
                characters: {},
                order: [],
            };
        }

        const characters = items.reduce((acc: Record<string, number>, item) => {
            let char = item.sortTitle.charAt(0);

            if (!isNaN(Number(char))) {
                char = '#';
            }

            if (char in acc) {
                acc[char] = acc[char] + 1;
            }
            else {
                acc[char] = 1;
            }

            return acc;
        }, {});

        const order = Object.keys(characters).sort();

        // Reverse if sorting descending
        if ((sortDirection as SortDirection) === DESCENDING) {
            order.reverse();
        }

        return {
            characters,
            order,
        };
    }, [items, sortKey, sortDirection]);
    const ViewComponent = useMemo(() => getViewComponent(view), [view]);

    const isLoaded = !!(!error && isPopulated && items.length);
    const hasNoComics = !totalItems;

    return (
        <SelectProvider items={items}>
            <PageContent>
                <PageToolbar>
                    <PageToolbarSection>
                        <ComicsIndexRefreshComicsButton
                            isSelectMode={isSelectMode}
                            selectedFilterKey={selectedFilterKey}
                        />

                        <PageToolbarSeparator />

                        <ComicsIndexSelectModeButton
                            label={
                                isSelectMode
                                    ? translate('StopSelecting')
                                    : translate('SelectComics')
                            }
                            iconName={isSelectMode ? icons.COMICS_ENDED : icons.CHECK}
                            isSelectMode={isSelectMode}
                            overflowComponent={ComicsIndexSelectModeMenuItem}
                            onPress={onSelectModePress}
                        />

                        <ComicsIndexSelectAllButton
                            label="SelectAll"
                            isSelectMode={isSelectMode}
                            overflowComponent={ComicsIndexSelectAllMenuItem}
                        />

                        <PageToolbarSeparator />
                        <ParseToolbarButton />
                    </PageToolbarSection>

                    <PageToolbarSection alignContent={align.RIGHT} collapseButtons={false}>
                        {view === 'table' ? (
                            <TableOptionsModalWrapper
                                columns={columns}
                                optionsComponent={ComicsIndexTableOptions}
                                onTableOptionChange={onTableOptionChange}
                            >
                                <PageToolbarButton
                                    label={translate('Options')}
                                    iconName={icons.TABLE}
                                />
                            </TableOptionsModalWrapper>
                        ) : (
                            <PageToolbarButton
                                label={translate('Options')}
                                iconName={view === 'posters' ? icons.POSTER : icons.OVERVIEW}
                                isDisabled={hasNoComics}
                                onPress={onOptionsPress}
                            />
                        )}

                        <PageToolbarSeparator />

                        <ComicsIndexViewMenu
                            view={view}
                            isDisabled={hasNoComics}
                            onViewSelect={onViewSelect}
                        />

                        <ComicsIndexSortMenu
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            isDisabled={hasNoComics}
                            onSortSelect={onSortSelect}
                        />

                        <ComicsIndexFilterMenu
                            selectedFilterKey={selectedFilterKey}
                            filters={filters}
                            customFilters={customFilters}
                            isDisabled={hasNoComics}
                            onFilterSelect={onFilterSelect}
                        />
                    </PageToolbarSection>
                </PageToolbar>
                <div className={styles.pageContentBodyWrapper}>
                    <PageContentBody
                        ref={scrollerRef}
                        className={styles.contentBody}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        innerClassName={styles[`${view}InnerContentBody`]}
                        initialScrollTop={props.initialScrollTop}
                        onScroll={onScroll}
                    >
                        {isFetching && !isPopulated ? <LoadingIndicator /> : null}

                        {!isFetching && !!error ? (
                            <Alert kind={kinds.DANGER}>{translate('ComicsLoadError')}</Alert>
                        ) : null}

                        {isLoaded ? (
                            <div className={styles.contentBodyContainer}>
                                <ViewComponent
                                    scrollerRef={scrollerRef}
                                    items={items}
                                    sortKey={sortKey}
                                    sortDirection={sortDirection}
                                    jumpToCharacter={jumpToCharacter}
                                    isSelectMode={isSelectMode}
                                    isSmallScreen={isSmallScreen}
                                />

                                <ComicsIndexFooter />
                            </div>
                        ) : null}

                        {!error && isPopulated && !items.length ? (
                            <NoComics totalItems={totalItems} />
                        ) : null}
                    </PageContentBody>
                    {isLoaded && !!jumpBarItems.order.length ? (
                        <PageJumpBar items={jumpBarItems} onItemPress={onJumpBarItemPress} />
                    ) : null}
                </div>

                {isSelectMode ? <ComicsIndexSelectFooter /> : null}

                {view === 'posters' ? (
                    <ComicsIndexPosterOptionsModal
                        isOpen={isOptionsModalOpen}
                        onModalClose={onOptionsModalClose}
                    />
                ) : null}
                {view === 'overview' ? (
                    <ComicsIndexOverviewOptionsModal
                        isOpen={isOptionsModalOpen}
                        onModalClose={onOptionsModalClose}
                    />
                ) : null}
            </PageContent>
        </SelectProvider>
    );
}, 'comicsIndex');

export default ComicsIndex;
