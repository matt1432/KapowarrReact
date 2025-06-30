import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useSelect } from 'App/SelectContext';
import { type AppState } from 'App/State/AppState';
import { type ImportComics } from 'App/State/ImportComicsAppState';
import FormInputGroup from 'Components/Form/FormInputGroup';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import VirtualTableSelectCell from 'Components/Table/Cells/VirtualTableSelectCell';
import { inputTypes } from 'Helpers/Props';
// import { setImportComicsValue } from 'Store/Actions/importComicsActions';
import createExistingComicsSelector from 'Store/Selectors/createExistingComicsSelector';
import { type InputChanged } from 'typings/inputs';
import { type SelectStateInputProps } from 'typings/props';
import ImportComicsSelectComics from './SelectComics/ImportComicsSelectComics';
import styles from './ImportComicsRow.module.css';

function createItemSelector(id: string) {
    return createSelector(
        (state: AppState) => state.importComics.items,
        (items) => {
            return (
                items.find((item) => {
                    return item.id === id;
                }) || ({} as ImportComics)
            );
        },
    );
}

interface ImportComicsRowProps {
    id: string;
}

function ImportComicsRow({ id }: ImportComicsRowProps) {
    const dispatch = useDispatch();

    const { relativePath, monitor, qualityProfileId, seasonFolder, comicsType, selectedComics } =
        useSelector(createItemSelector(id));

    const isExistingComics = useSelector(createExistingComicsSelector(selectedComics?.tvdbId));

    const [selectState, selectDispatch] = useSelect();

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged) => {
            dispatch(
                // @ts-expect-error - actions are not typed
                setImportComicsValue({
                    id,
                    [name]: value,
                }),
            );
        },
        [id, dispatch],
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

    return (
        <>
            <VirtualTableSelectCell
                inputClassName={styles.selectInput}
                id={id}
                isSelected={selectState.selectedState[id]}
                isDisabled={!selectedComics || isExistingComics}
                onSelectedChange={handleSelectedChange}
            />

            <VirtualTableRowCell className={styles.folder}>{relativePath}</VirtualTableRowCell>

            <VirtualTableRowCell className={styles.monitor}>
                <FormInputGroup
                    type={inputTypes.MONITOR_ISSUES_SELECT}
                    name="monitor"
                    value={monitor}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.qualityProfile}>
                <FormInputGroup
                    type={inputTypes.QUALITY_PROFILE_SELECT}
                    name="qualityProfileId"
                    value={qualityProfileId}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.comicsType}>
                <FormInputGroup
                    type={inputTypes.COMICS_TYPE_SELECT}
                    name="comicsType"
                    value={comicsType}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.seasonFolder}>
                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="seasonFolder"
                    value={seasonFolder}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.comics}>
                <ImportComicsSelectComics id={id} onInputChange={handleInputChange} />
            </VirtualTableRowCell>
        </>
    );
}

export default ImportComicsRow;
