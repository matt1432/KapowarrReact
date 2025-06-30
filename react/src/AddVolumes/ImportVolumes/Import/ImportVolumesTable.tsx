import { type RefObject, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
// import { useAddVolumesOptions } from 'AddVolumes/addVolumesOptionsStore';
import { useSelect } from 'App/SelectContext';
import { type AppState } from 'App/State/AppState';
import { type ImportVolumes } from 'App/State/ImportVolumesAppState';
import VirtualTable from 'Components/Table/VirtualTable';
import usePrevious from 'Helpers/Hooks/usePrevious';
// import { queueLookupVolumes, setImportVolumesValue } from 'Store/Actions/importVolumesActions';
import createAllVolumesSelector from 'Store/Selectors/createAllVolumesSelector';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import { type CheckInputChanged } from 'typings/inputs';
import { type SelectStateInputProps } from 'typings/props';
import { type UnmappedFolder } from 'typings/RootFolder';
import ImportVolumesHeader from './ImportVolumesHeader';
import ImportVolumesRow from './ImportVolumesRow';
import styles from './ImportVolumesTable.module.css';

const ROW_HEIGHT = 52;

interface RowItemData {
    items: ImportVolumes[];
}

interface ImportVolumesTableProps {
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
            <ImportVolumesRow key={item.id} id={item.id} />
        </div>
    );
}

function ImportVolumesTable({ unmappedFolders, scrollerRef }: ImportVolumesTableProps) {
    const dispatch = useDispatch();

    // const { monitor, qualityProfileId, volumesType, seasonFolder } = useAddVolumesOptions();

    const items = useSelector((state: AppState) => state.importVolumes.items);
    const { isSmallScreen } = useSelector(createDimensionsSelector());
    const allVolumes = useSelector(createAllVolumesSelector());
    const [selectState, selectDispatch] = useSelect();

    /*
    const defaultValues = useRef({
        monitor,
        qualityProfileId,
        volumesType,
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
                queueLookupVolumes({
                    name,
                    path,
                    relativePath,
                    term: name,
                }),
            );

            dispatch(
                // @ts-expect-error - actions are not typed
                setImportVolumesValue({
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

            const selectedVolumes = item.selectedVolumes;
            const isSelected = selectedState[id];

            const isExistingVolumes =
                !!selectedVolumes && allVolumes.some((s) => s.tvdbId === selectedVolumes.tvdbId);

            if (
                (!selectedVolumes && prevItem.selectedVolumes) ||
                (isExistingVolumes && !prevItem.selectedVolumes)
            ) {
                handleSelectedChange({ id, value: false, shiftKey: false });

                return;
            }

            if (isSelected && (!selectedVolumes || isExistingVolumes)) {
                handleSelectedChange({ id, value: false, shiftKey: false });

                return;
            }

            if (selectedVolumes && selectedVolumes !== prevItem.selectedVolumes) {
                handleSelectedChange({ id, value: true, shiftKey: false });

                return;
            }
        });
    }, [
        allVolumes,
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
                <ImportVolumesHeader
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

export default ImportVolumesTable;
