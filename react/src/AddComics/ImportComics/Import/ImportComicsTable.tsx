import { type RefObject, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
// import { useAddComicsOptions } from 'AddComics/addComicsOptionsStore';
import { useSelect } from 'App/SelectContext';
import { type AppState } from 'App/State/AppState';
import { type ImportComics } from 'App/State/ImportComicsAppState';
import VirtualTable from 'Components/Table/VirtualTable';
import usePrevious from 'Helpers/Hooks/usePrevious';
// import { queueLookupComics, setImportComicsValue } from 'Store/Actions/importComicsActions';
import createAllComicsSelector from 'Store/Selectors/createAllComicsSelector';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import { type CheckInputChanged } from 'typings/inputs';
import { type SelectStateInputProps } from 'typings/props';
import { type UnmappedFolder } from 'typings/RootFolder';
import ImportComicsHeader from './ImportComicsHeader';
import ImportComicsRow from './ImportComicsRow';
import styles from './ImportComicsTable.module.css';

const ROW_HEIGHT = 52;

interface RowItemData {
    items: ImportComics[];
}

interface ImportComicsTableProps {
    unmappedFolders: UnmappedFolder[];
    scrollerRef: RefObject<HTMLElement>;
}

function Row({ index, style, data }: ListChildComponentProps<RowItemData>) {
    const { items } = data;

    if (index >= items.length) {
        return null;
    }

    const item = items[index];

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                ...style,
            }}
            className={styles.row}
        >
            <ImportComicsRow key={item.id} id={item.id} />
        </div>
    );
}

function ImportComicsTable({ unmappedFolders, scrollerRef }: ImportComicsTableProps) {
    const dispatch = useDispatch();

    // const { monitor, qualityProfileId, comicsType, seasonFolder } = useAddComicsOptions();

    const items = useSelector((state: AppState) => state.importComics.items);
    const { isSmallScreen } = useSelector(createDimensionsSelector());
    const allComics = useSelector(createAllComicsSelector());
    const [selectState, selectDispatch] = useSelect();

    /*
    const defaultValues = useRef({
        monitor,
        qualityProfileId,
        comicsType,
        seasonFolder,
    });
    */

    const listRef = useRef<FixedSizeList<RowItemData>>(undefined) as RefObject<
        FixedSizeList<RowItemData>
    >;
    const initialUnmappedFolders = useRef(unmappedFolders);
    const previousItems = usePrevious(items);
    const { allSelected, allUnselected, selectedState } = selectState;

    const handleSelectAllChange = useCallback(
        ({ value }: CheckInputChanged) => {
            selectDispatch({
                type: value ? 'selectAll' : 'unselectAll',
            });
        },
        [selectDispatch],
    );

    const handleSelectedChange = useCallback(
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

    const handleRemoveSelectedStateItem = useCallback(
        (id: string) => {
            selectDispatch({
                type: 'removeItem',
                id,
            });
        },
        [selectDispatch],
    );

    useEffect(() => {
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        initialUnmappedFolders.current.forEach(({ name, path, relativePath }) => {
            /*
            dispatch(
                queueLookupComics({
                    name,
                    path,
                    relativePath,
                    term: name,
                }),
            );

            dispatch(
                // @ts-expect-error - actions are not typed
                setImportComicsValue({
                    id: name,
                    ...defaultValues.current,
                }),
            );
            */
        });
    }, [dispatch]);

    useEffect(() => {
        previousItems?.forEach((prevItem) => {
            const { id } = prevItem;

            const item = items.find((i) => i.id === id);

            if (!item) {
                handleRemoveSelectedStateItem(id);
                return;
            }

            const selectedComics = item.selectedComics;
            const isSelected = selectedState[id];

            const isExistingComics =
                !!selectedComics && allComics.some((s) => s.tvdbId === selectedComics.tvdbId);

            if (
                (!selectedComics && prevItem.selectedComics) ||
                (isExistingComics && !prevItem.selectedComics)
            ) {
                handleSelectedChange({ id, value: false, shiftKey: false });

                return;
            }

            if (isSelected && (!selectedComics || isExistingComics)) {
                handleSelectedChange({ id, value: false, shiftKey: false });

                return;
            }

            if (selectedComics && selectedComics !== prevItem.selectedComics) {
                handleSelectedChange({ id, value: true, shiftKey: false });

                return;
            }
        });
    }, [
        allComics,
        items,
        previousItems,
        selectedState,
        handleRemoveSelectedStateItem,
        handleSelectedChange,
    ]);

    if (!items.length) {
        return null;
    }

    return (
        <VirtualTable
            Header={
                <ImportComicsHeader
                    allSelected={allSelected}
                    allUnselected={allUnselected}
                    onSelectAllChange={handleSelectAllChange}
                />
            }
            itemCount={items.length}
            itemData={{
                items,
            }}
            isSmallScreen={isSmallScreen}
            listRef={listRef}
            rowHeight={ROW_HEIGHT}
            Row={Row}
            scrollerRef={scrollerRef}
        />
    );
}

export default ImportComicsTable;
