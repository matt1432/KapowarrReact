import { useCallback } from 'react';
import { useDispatch /*, useSelector*/ } from 'react-redux';
// import { createSelector } from 'reselect';
import { useSelect } from 'App/SelectContext';
// import { type AppState } from 'App/State/AppState';
// import { type ImportVolume } from 'App/State/ImportVolumeAppState';
import FormInputGroup from 'Components/Form/FormInputGroup';
import VirtualTableRowCell from 'Components/Table/Cells/VirtualTableRowCell';
import VirtualTableSelectCell from 'Components/Table/Cells/VirtualTableSelectCell';
import { inputTypes } from 'Helpers/Props';
// import { setImportVolumeValue } from 'Store/Actions/importVolumeActions';
// import createExistingVolumeSelector from 'Store/Selectors/createExistingVolumeSelector';
import { type InputChanged } from 'typings/inputs';
import { type SelectStateInputProps } from 'typings/props';
import ImportVolumeSelectVolume from './SelectVolume/ImportVolumeSelectVolume';
import styles from './ImportVolumeRow.module.css';

/*
function createItemSelector(id: string) {
    return createSelector(
        (state: AppState) => state.importVolume.items,
        (items) => {
            return (
                items.find((item) => {
                    return item.id === id;
                }) || ({} as ImportVolume)
            );
        },
    );
}
*/

interface ImportVolumeRowProps {
    id: string;
}

function ImportVolumeRow({ id }: ImportVolumeRowProps) {
    const dispatch = useDispatch();

    // const { relativePath, monitor, qualityProfileId, volumeType, selectedVolume } =
    // useSelector(createItemSelector(id));

    const isExistingVolume = false; // useSelector(createExistingVolumeSelector(selectedVolume?.tvdbId));

    const [selectState, selectDispatch] = useSelect();

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged) => {
            dispatch(
                // @ts-expect-error - actions are not typed
                setImportVolumeValue({
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
                isDisabled={/*!selectedVolume ||*/ isExistingVolume}
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

            <VirtualTableRowCell className={styles.volumeType}>
                <FormInputGroup
                    type={inputTypes.VOLUME_TYPE_SELECT}
                    name="volumeType"
                    value={'' /*volumeType*/}
                    onChange={handleInputChange}
                />
            </VirtualTableRowCell>

            <VirtualTableRowCell className={styles.volume}>
                <ImportVolumeSelectVolume id={id} onInputChange={handleInputChange} />
            </VirtualTableRowCell>
        </>
    );
}

export default ImportVolumeRow;
