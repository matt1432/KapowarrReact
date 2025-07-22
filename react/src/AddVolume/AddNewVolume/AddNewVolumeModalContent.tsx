// IMPORTS

// React
// import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
// import { useSelector } from 'react-redux';
// import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
// import selectSettings from 'Store/Selectors/selectSettings';

// Misc
/*import {
    type AddVolumeOptions,
    setAddVolumeOption,
    useAddVolumeOptions,
} from 'AddVolume/addVolumeOptionsStore';*/
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
// import useIsWindows from 'System/useIsWindows';

// General Components
import CheckInput from 'Components/Form/CheckInput';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import SpinnerButton from 'Components/Link/SpinnerButton';
import VolumeMonitoringOptionsPopoverContent from 'AddVolume/VolumeMonitoringOptionsPopoverContent';
import VolumePoster from 'Volume/VolumePoster';
import VolumeTypePopoverContent from 'AddVolume/VolumeTypePopoverContent';

// Specific Components

// CSS
import styles from './AddNewVolumeModalContent.module.css';

// Types
import type { AddVolume } from 'AddVolume/AddVolume';
// import type { VolumeType } from 'Volume/Volume';
// import type { InputChanged } from 'typings/inputs';

export interface AddNewVolumeModalContentProps {
    volume: AddVolume;
    // @ts-expect-error TODO:
    initialVolumeType: VolumeType;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

function AddNewVolumeModalContent({
    volume,
    // initialVolumeType,
    onModalClose,
}: AddNewVolumeModalContentProps) {
    const {
        title,
        year,
        // @ts-expect-error TODO:
        overview,
        // images,
        folder,
    } = volume;
    // const options = useAddVolumeOptions();
    // const { isSmallScreen } = useSelector(createDimensionsSelector());
    const isSmallScreen = false;
    const isWindows = false; // useIsWindows();

    const { isPending: isAdding /*error: addError, mutate: addVolume */ } = { isPending: false }; // = useAddVolume();

    /*
    const { settings, validationErrors, validationWarnings } = useMemo(() => {
        return selectSettings(options, {}, addError);
    }, [options, addError]);

    const [volumeType, setVolumeType] = useState<VolumeType>(
        initialVolumeType === 'standard' ? settings.volumeType.value : initialVolumeType,
    );

    const {
        monitor,
        qualityProfileId,
        rootFolderPath,
        searchForCutoffUnmetIssues,
        searchForMissingIssues,
        seasonFolder,
        volumeType: volumeTypeSetting,
        tags,
    } = settings;

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged<string | number | boolean | number[]>) => {
            setAddVolumeOption(name as keyof AddVolumeOptions, value);
        },
        [],
    );

    const handleQualityProfileIdChange = useCallback(({ value }: InputChanged<string | number>) => {
        setAddVolumeOption('qualityProfileId', value as number);
    }, []);

    const handleAddVolumePress = useCallback(() => {
        addVolume({
            ...volume,
            rootFolderPath: rootFolderPath.value,
            monitor: monitor.value,
            qualityProfileId: qualityProfileId.value,
            volumeType,
            seasonFolder: seasonFolder.value,
            searchForMissingIssues: searchForMissingIssues.value,
            searchForCutoffUnmetIssues: searchForCutoffUnmetIssues.value,
            tags: tags.value,
        });
    }, [
        volume,
        volumeType,
        rootFolderPath,
        monitor,
        qualityProfileId,
        seasonFolder,
        searchForMissingIssues,
        searchForCutoffUnmetIssues,
        tags,
        addVolume,
    ]);

    useEffect(() => {
        setVolumeType(volumeTypeSetting.value);
    }, [volumeTypeSetting]);*/

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {title}

                {!title.includes(String(year)) && year ? (
                    <span className={styles.year}>({year})</span>
                ) : null}
            </ModalHeader>

            <ModalBody>
                <div className={styles.container}>
                    {isSmallScreen ? null : (
                        <div className={styles.poster}>
                            <VolumePoster volume={volume} className={styles.poster} size={250} />
                        </div>
                    )}

                    <div className={styles.info}>
                        {overview ? <div className={styles.overview}>{overview}</div> : null}

                        <Form
                        // validationErrors={validationErrors}
                        // validationWarnings={validationWarnings}
                        >
                            <FormGroup>
                                <FormLabel>{translate('RootFolder')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.ROOT_FOLDER_SELECT}
                                    name="rootFolderPath"
                                    valueOptions={{
                                        volumeFolder: folder,
                                        isWindows,
                                    }}
                                    selectedValueOptions={{
                                        volumeFolder: folder,
                                        isWindows,
                                    }}
                                    helpText={translate('AddNewVolumeRootFolderHelpText', {
                                        folder,
                                    })}
                                    onChange={() => {} /*handleInputChange*/}
                                    // {...rootFolderPath}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('Monitor')}

                                    <Popover
                                        anchor={
                                            <Icon className={styles.labelIcon} name={icons.INFO} />
                                        }
                                        title={translate('MonitoringOptions')}
                                        body={<VolumeMonitoringOptionsPopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.MONITOR_ISSUES_SELECT}
                                    name="monitor"
                                    onChange={() => {} /*handleInputChange*/}
                                    value={''}
                                    // {...monitor}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('VolumeType')}

                                    <Popover
                                        anchor={
                                            <Icon className={styles.labelIcon} name={icons.INFO} />
                                        }
                                        title={translate('VolumeTypes')}
                                        body={<VolumeTypePopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.VOLUME_TYPE_SELECT}
                                    name="volumeType"
                                    onChange={() => {} /*handleInputChange*/}
                                    // {...volumeTypeSetting}
                                    // value={volumeType}
                                    value={''}
                                    helpText={translate('VolumeTypesHelpText')}
                                />
                            </FormGroup>
                        </Form>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter className={styles.modalFooter}>
                <div>
                    <label className={styles.searchLabelContainer}>
                        <span className={styles.searchLabel}>
                            {translate('AddNewVolumeSearchForMissingIssues')}
                        </span>

                        <CheckInput
                            containerClassName={styles.searchInputContainer}
                            className={styles.searchInput}
                            name="searchForMissingIssues"
                            onChange={() => {} /*handleInputChange*/}
                            // {...searchForMissingIssues}
                        />
                    </label>

                    <label className={styles.searchLabelContainer}>
                        <span className={styles.searchLabel}>
                            {translate('AddNewVolumeSearchForCutoffUnmetIssues')}
                        </span>

                        <CheckInput
                            containerClassName={styles.searchInputContainer}
                            className={styles.searchInput}
                            name="searchForCutoffUnmetIssues"
                            onChange={() => {} /*handleInputChange*/}
                            // {...searchForCutoffUnmetIssues}
                        />
                    </label>
                </div>

                <SpinnerButton
                    className={styles.addButton}
                    kind={kinds.SUCCESS}
                    isSpinning={isAdding}
                    // onPress={handleAddVolumePress}
                >
                    {translate('AddVolumeWithTitle', { title })}
                </SpinnerButton>
            </ModalFooter>
        </ModalContent>
    );
}

export default AddNewVolumeModalContent;
