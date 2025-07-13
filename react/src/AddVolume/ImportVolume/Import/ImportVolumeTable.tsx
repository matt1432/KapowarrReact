/*
import { type RefObject, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
// import { useAddVolumeOptions } from 'AddVolume/addVolumeOptionsStore';
import { useSelect } from 'App/SelectContext';
import { type AppState } from 'App/State/AppState';
import { type ImportVolume } from 'App/State/ImportVolumeAppState';
import VirtualTable from 'Components/Table/VirtualTable';
import usePrevious from 'Helpers/Hooks/usePrevious';
// import { queueLookupVolume, setImportVolumeValue } from 'Store/Actions/importVolumeActions';
import createAllVolumeSelector from 'Store/Selectors/createAllVolumeSelector';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import { type CheckInputChanged } from 'typings/inputs';
import { type SelectStateInputProps } from 'typings/props';
import { type UnmappedFolder } from 'typings/RootFolder';
import ImportVolumeHeader from './ImportVolumeHeader';
import ImportVolumeRow from './ImportVolumeRow';
import styles from './ImportVolumeTable.module.css';

const ROW_HEIGHT = 52;

interface RowItemData {
    items: ImportVolume[];
}

interface ImportVolumeTableProps {
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
            <ImportVolumeRow key={item.id} id={item.id} />
        </div>
    );
}

function ImportVolumeTable({ unmappedFolders, scrollerRef }: ImportVolumeTableProps) {
    const dispatch = useDispatch();

    // const { monitor, qualityProfileId, volumeType, seasonFolder } = useAddVolumeOptions();

    const items = useSelector((state: AppState) => state.importVolume.items);
    const { isSmallScreen } = useSelector(createDimensionsSelector());
    const allVolume = useSelector(createAllVolumeSelector());
    const [selectState, selectDispatch] = useSelect();

    const defaultValues = useRef({
        monitor,
        qualityProfileId,
        volumeType,
        seasonFolder,
    });

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
            dispatch(
                queueLookupVolume({
                    name,
                    path,
                    relativePath,
                    term: name,
                }),
            );

            dispatch(
                // @ts-expect-error - actions are not typed
                setImportVolumeValue({
                    id: name,
                    ...defaultValues.current,
                }),
            );
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

            const selectedVolume = item.selectedVolume;
            const isSelected = selectedState[id];

            const isExistingVolume =
                !!selectedVolume && allVolume.some((s) => s.tvdbId === selectedVolume.tvdbId);

            if (
                (!selectedVolume && prevItem.selectedVolume) ||
                (isExistingVolume && !prevItem.selectedVolume)
            ) {
                handleSelectedChange({ id, value: false, shiftKey: false });

                return;
            }

            if (isSelected && (!selectedVolume || isExistingVolume)) {
                handleSelectedChange({ id, value: false, shiftKey: false });

                return;
            }

            if (selectedVolume && selectedVolume !== prevItem.selectedVolume) {
                handleSelectedChange({ id, value: true, shiftKey: false });

                return;
            }
        });
    }, [
        allVolume,
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
                <ImportVolumeHeader
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
export default ImportVolumeTable;
*/

// @ts-expect-error TODO
// eslint-disable-next-line
export default (props: any) => null;
