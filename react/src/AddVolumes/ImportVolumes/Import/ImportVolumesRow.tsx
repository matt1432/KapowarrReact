import { useCallback } from 'react';
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { createSelector } from 'reselect';
import { useSelect } from 'App/SelectContext';
// import { type AppState } from 'App/State/AppState';
// import { type ImportVolumes } from 'App/State/ImportVolumesAppState';
import FormInputGroup from 'Components/Form/FormInputGroup';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import VirtualTableSelectCell from 'Components/Table/Cells/VirtualTableSelectCell';
import { inputTypes } from 'Helpers/Props';
// import { setImportVolumesValue } from 'Store/Actions/importVolumesActions';
// import createExistingVolumesSelector from 'Store/Selectors/createExistingVolumesSelector';
import { type InputChanged } from 'typings/inputs';
import { type SelectStateInputProps } from 'typings/props';
import ImportVolumesSelectVolumes from './SelectVolumes/ImportVolumesSelectVolumes';
import styles from './ImportVolumesRow.module.css';

/*
function createItemSelector(id: string) {
    return createSelector(
        (state: AppState) => state.importVolumes.items,
        (items) => {
            return (
                items.find((item) => {
                    return item.id === id;
                }) || ({} as ImportVolumes)
            );
        },
    );
}
*/

interface ImportVolumesRowProps {
    id: string;
}

function ImportVolumesRow({ id }: ImportVolumesRowProps) {
    const dispatch = useDispatch();

    // const { relativePath, monitor, qualityProfileId, seasonFolder, volumesType, selectedVolumes } =
    // useSelector(createItemSelector(id));

    const isExistingVolumes = false; // useSelector(createExistingVolumesSelector(selectedVolumes?.tvdbId));

    const [selectState, selectDispatch] = useSelect();

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged) => {
            dispatch(
                // @ts-expect-error - actions are not typed
                setImportVolumesValue({
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
                isDisabled={/*!selectedVolumes ||*/ isExistingVolumes}
                onSelectedChange={handleSelectedChange}
            />

            <VirtualTableRowCell className={styles.folder}>{/*relativePath*/}</VirtualTableRowCell>

            <VirtualTableRowCell className={styles.monitor}>
                <FormInputGroup
                    type={inputTypes.MONITOR_ISSUES_SELECT}
                    name="monitor"
                    value={'' /*monitor*/}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.qualityProfile}>
                <FormInputGroup
                    type={inputTypes.QUALITY_PROFILE_SELECT}
                    name="qualityProfileId"
                    value={'' /*qualityProfileId*/}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.volumesType}>
                <FormInputGroup
                    type={inputTypes.VOLUMES_TYPE_SELECT}
                    name="volumesType"
                    value={'' /*volumesType*/}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.seasonFolder}>
                <FormInputGroup
                    type={inputTypes.CHECK}
                    name="seasonFolder"
                    value={'' /*seasonFolder*/}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.volumes}>
                <ImportVolumesSelectVolumes id={id} onInputChange={handleInputChange} />
            </VirtualTableRowCell>
        </>
    );
}

export default ImportVolumesRow;
