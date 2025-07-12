import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SelectProvider } from 'App/SelectContext';
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
import NoVolumes from 'Volumes/NoVolumes';
// TODO:
// import { fetchQueueDetails } from 'Store/Actions/queueActions';
// import { fetchVolumes } from 'Store/Actions/volumesActions';
/*import {
    setVolumesFilter,
    setVolumesSort,
    setVolumesTableOption,
    setVolumesView,
} from 'Store/Actions/volumesIndexActions';*/
import scrollPositions from 'Store/scrollPositions';
import { selectDimensions } from 'Store/Slices/App';
import translate from 'Utilities/String/translate';
import VolumesIndexFilterMenu from './Menus/VolumesIndexFilterMenu';
import VolumesIndexSortMenu from './Menus/VolumesIndexSortMenu';
import VolumesIndexViewMenu from './Menus/VolumesIndexViewMenu';
import VolumesIndexPosterOptionsModal from './Posters/Options/VolumesIndexPosterOptionsModal';
import VolumesIndexPosters from './Posters/VolumesIndexPosters';
import VolumesIndexSelectAllButton from './Select/VolumesIndexSelectAllButton';
import VolumesIndexSelectAllMenuItem from './Select/VolumesIndexSelectAllMenuItem';
import VolumesIndexSelectFooter from './Select/VolumesIndexSelectFooter';
import VolumesIndexSelectModeButton from './Select/VolumesIndexSelectModeButton';
import VolumesIndexSelectModeMenuItem from './Select/VolumesIndexSelectModeMenuItem';
import VolumesIndexFooter from './VolumesIndexFooter';
import VolumesIndexRefreshVolumesButton from './VolumesIndexRefreshVolumesButton';
import VolumesIndexTableOptions from './Table/VolumesIndexTableOptions';
import styles from './index.module.css';
import { useGetVolumesQuery } from 'Store/createApiEndpoints';
import type { VolumePublicInfo } from 'Volumes/Volumes';

export type IndexView = 'posters' | 'table';
export type IndexFilter = '' | 'wanted' | 'monitored';
export type IndexSort =
    | 'title'
    | 'volume_number'
    | 'year'
    | 'recently_added'
    | 'recently_released'
    | 'publisher'
    | 'wanted';

interface VolumesIndexProps {
    initialScrollTop?: number;
}

const VolumesIndex = withScrollPosition((props: VolumesIndexProps) => {
    /*
    const {
        columns,
    }: VolumesAppState & VolumesIndexAppState & ClientSideCollectionAppState = useSelector(
        createVolumesClientSideCollectionItemsSelector('volumesIndex'),
    );
    */
    // TODO: put this in the store?
    const [view, setView] = useState<IndexView>('posters');
    const [items, setItems] = useState<VolumePublicInfo[]>([]);
    const [sortKey, setSortKey] = useState<IndexSort>('title');
    const [filterKey, setFilterKey] = useState<IndexFilter>('');
    const [sortDirection /*, setSortDirection*/] = useState<SortDirection>('ascending');

    const { columns } = {
        columns: [],
    };

    const { isFetching, error, data } = useGetVolumesQuery({
        sort: sortKey,
        filter: filterKey,
    });

    useEffect(() => {
        setItems(data ?? []);
    }, [data]);

    const isPopulated = items !== undefined;
    const totalItems = items.length;

    const { isSmallScreen } = useSelector(selectDimensions);
    const dispatch = useDispatch();
    const scrollerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [jumpToCharacter, setJumpToCharacter] = useState<string | undefined>(undefined);
    const [isSelectMode, setIsSelectMode] = useState(false);

    useEffect(() => {
        console.log(items);
        // dispatch(fetchVolumes());
        // dispatch(fetchQueueDetails({ all: true }));
    }, [dispatch, items]);

    const onSelectModePress = useCallback(() => {
        setIsSelectMode(!isSelectMode);
    }, [isSelectMode, setIsSelectMode]);

    const onTableOptionChange = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (payload: unknown) => {
            // dispatch(setVolumesTableOption(payload));
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
            scrollPositions.volumesIndex = scrollTop;
        },
        [setJumpToCharacter],
    );

    const jumpBarItems: PageJumpBarItems = useMemo(() => {
        // Reset if not sorting by title
        if (sortKey !== 'title') {
            return {
                characters: {},
                order: [],
            };
        }

        const characters = items.reduce((acc: Record<string, number>, item) => {
            let char = item.title.charAt(0);

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

    const isLoaded = !!(!error && isPopulated && items.length);
    const hasNoVolumes = !totalItems;

    return (
        <SelectProvider items={items}>
            <PageContent>
                <PageToolbar>
                    <PageToolbarSection>
                        <VolumesIndexRefreshVolumesButton
                            isSelectMode={isSelectMode}
                            filterKey={filterKey}
                        />

                        <PageToolbarSeparator />

                        <VolumesIndexSelectModeButton
                            label={
                                isSelectMode
                                    ? translate('StopSelecting')
                                    : translate('SelectVolumes')
                            }
                            iconName={isSelectMode ? icons.VOLUMES_ENDED : icons.CHECK}
                            isSelectMode={isSelectMode}
                            overflowComponent={VolumesIndexSelectModeMenuItem}
                            onPress={onSelectModePress}
                        />

                        <VolumesIndexSelectAllButton
                            label="SelectAll"
                            isSelectMode={isSelectMode}
                            overflowComponent={VolumesIndexSelectAllMenuItem}
                        />

                        <PageToolbarSeparator />
                        <ParseToolbarButton />
                    </PageToolbarSection>

                    <PageToolbarSection alignContent={align.RIGHT} collapseButtons={false}>
                        {view === 'table' ? (
                            <TableOptionsModalWrapper
                                columns={columns}
                                optionsComponent={VolumesIndexTableOptions}
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
                                isDisabled={hasNoVolumes}
                                onPress={onOptionsPress}
                            />
                        )}

                        <PageToolbarSeparator />

                        <VolumesIndexViewMenu
                            view={view}
                            isDisabled={hasNoVolumes}
                            onViewSelect={(value: IndexView) => {
                                setView(value);

                                if (scrollerRef.current) {
                                    scrollerRef.current.scrollTo(0, 0);
                                }
                            }}
                        />

                        <VolumesIndexSortMenu
                            sortKey={sortKey}
                            sortDirection={sortDirection}
                            isDisabled={hasNoVolumes}
                            onSortSelect={(value: IndexSort) => setSortKey(value)}
                        />

                        <VolumesIndexFilterMenu
                            filterKey={filterKey}
                            isDisabled={hasNoVolumes}
                            onFilterSelect={(value: IndexFilter) => setFilterKey(value)}
                        />
                    </PageToolbarSection>
                </PageToolbar>
                <div className={styles.pageContentBodyWrapper}>
                    <PageContentBody
                        ref={scrollerRef}
                        className={styles.contentBody}
                        innerClassName={styles[`${view}InnerContentBody`]}
                        initialScrollTop={props.initialScrollTop}
                        onScroll={onScroll}
                    >
                        {isFetching && !isPopulated ? <LoadingIndicator /> : null}

                        {!isFetching && !!error ? (
                            <Alert kind={kinds.DANGER}>{translate('VolumesLoadError')}</Alert>
                        ) : null}

                        {isLoaded ? (
                            <div className={styles.contentBodyContainer}>
                                <VolumesIndexPosters
                                    scrollerRef={scrollerRef}
                                    items={items}
                                    sortKey={sortKey}
                                    sortDirection={sortDirection}
                                    jumpToCharacter={jumpToCharacter}
                                    isSelectMode={isSelectMode}
                                    isSmallScreen={isSmallScreen}
                                />

                                <VolumesIndexFooter />
                            </div>
                        ) : null}

                        {!error && isPopulated && !items.length ? (
                            <NoVolumes totalItems={totalItems} />
                        ) : null}
                    </PageContentBody>
                    {isLoaded && !!jumpBarItems.order.length ? (
                        <PageJumpBar items={jumpBarItems} onItemPress={onJumpBarItemPress} />
                    ) : null}
                </div>

                {isSelectMode ? <VolumesIndexSelectFooter /> : null}

                {view === 'posters' ? (
                    <VolumesIndexPosterOptionsModal
                        isOpen={isOptionsModalOpen}
                        onModalClose={onOptionsModalClose}
                    />
                ) : null}
            </PageContent>
        </SelectProvider>
    );
}, 'volumesIndex');

export default VolumesIndex;
