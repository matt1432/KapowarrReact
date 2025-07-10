// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
import { type AddVolumes } from 'AddVolumes/AddVolumes';
/*import {
    type AddVolumesOptions,
    setAddVolumesOption,
    useAddVolumesOptions,
} from 'AddVolumes/addVolumesOptionsStore';*/
import VolumesMonitoringOptionsPopoverContent from 'AddVolumes/VolumesMonitoringOptionsPopoverContent';
import VolumesTypePopoverContent from 'AddVolumes/VolumesTypePopoverContent';
import CheckInput from 'Components/Form/CheckInput';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import SpinnerButton from 'Components/Link/SpinnerButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';
import { type VolumesType } from 'Volumes/Volumes';
import VolumesPoster from 'Volumes/VolumesPoster';
// import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
// import selectSettings from 'Store/Selectors/selectSettings';
// import useIsWindows from 'System/useIsWindows';
// import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import { useAddVolumes } from './useAddVolumes';
import styles from './AddNewVolumesModalContent.module.css';

export interface AddNewVolumesModalContentProps {
    volumes: AddVolumes;
    initialVolumesType: VolumesType;
    onModalClose: () => void;
}

function AddNewVolumesModalContent({
    volumes,
    // initialVolumesType,
    onModalClose,
}: AddNewVolumesModalContentProps) {
    const { title, year, overview, images, folder } = volumes;
    // const options = useAddVolumesOptions();
    // const { isSmallScreen } = useSelector(createDimensionsSelector());
    const isSmallScreen = false;
    const isWindows = false; // useIsWindows();

    const { isPending: isAdding /*error: addError, mutate: addVolumes */ } = useAddVolumes();

    /*
    const { settings, validationErrors, validationWarnings } = useMemo(() => {
        return selectSettings(options, {}, addError);
    }, [options, addError]);

    const [volumesType, setVolumesType] = useState<VolumesType>(
        initialVolumesType === 'standard' ? settings.volumesType.value : initialVolumesType,
    );

    const {
        monitor,
        qualityProfileId,
        rootFolderPath,
        searchForCutoffUnmetIssues,
        searchForMissingIssues,
        seasonFolder,
        volumesType: volumesTypeSetting,
        tags,
    } = settings;

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged<string | number | boolean | number[]>) => {
            setAddVolumesOption(name as keyof AddVolumesOptions, value);
        },
        [],
    );

    const handleQualityProfileIdChange = useCallback(({ value }: InputChanged<string | number>) => {
        setAddVolumesOption('qualityProfileId', value as number);
    }, []);

    const handleAddVolumesPress = useCallback(() => {
        addVolumes({
            ...volumes,
            rootFolderPath: rootFolderPath.value,
            monitor: monitor.value,
            qualityProfileId: qualityProfileId.value,
            volumesType,
            seasonFolder: seasonFolder.value,
            searchForMissingIssues: searchForMissingIssues.value,
            searchForCutoffUnmetIssues: searchForCutoffUnmetIssues.value,
            tags: tags.value,
        });
    }, [
        volumes,
        volumesType,
        rootFolderPath,
        monitor,
        qualityProfileId,
        seasonFolder,
        searchForMissingIssues,
        searchForCutoffUnmetIssues,
        tags,
        addVolumes,
    ]);

    useEffect(() => {
        setVolumesType(volumesTypeSetting.value);
    }, [volumesTypeSetting]);*/

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
                            <VolumesPoster className={styles.poster} images={images} size={250} />
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
                                        volumesFolder: folder,
                                        isWindows,
                                    }}
                                    selectedValueOptions={{
                                        volumesFolder: folder,
                                        isWindows,
                                    }}
                                    helpText={translate('AddNewVolumesRootFolderHelpText', {
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
                                        body={<VolumesMonitoringOptionsPopoverContent />}
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
                                <FormLabel>{translate('QualityProfile')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.QUALITY_PROFILE_SELECT}
                                    name="qualityProfileId"
                                    onChange={() => {} /*handleQualityProfileIdChange*/}
                                    value={''}
                                    // {...qualityProfileId}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('VolumesType')}

                                    <Popover
                                        anchor={
                                            <Icon className={styles.labelIcon} name={icons.INFO} />
                                        }
                                        title={translate('VolumesTypes')}
                                        body={<VolumesTypePopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.VOLUMES_TYPE_SELECT}
                                    name="volumesType"
                                    onChange={() => {} /*handleInputChange*/}
                                    // {...volumesTypeSetting}
                                    // value={volumesType}
                                    value={''}
                                    helpText={translate('VolumesTypesHelpText')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>{translate('SeasonFolder')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.CHECK}
                                    name="seasonFolder"
                                    onChange={() => {} /*handleInputChange*/}
                                    // {...seasonFolder}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>{translate('Tags')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TAG}
                                    name="tags"
                                    onChange={() => {} /*handleInputChange*/}
                                    value={''}
                                    // {...tags}
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
                            {translate('AddNewVolumesSearchForMissingIssues')}
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
                            {translate('AddNewVolumesSearchForCutoffUnmetIssues')}
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
                    // onPress={handleAddVolumesPress}
                >
                    {translate('AddVolumesWithTitle', { title })}
                </SpinnerButton>
            </ModalFooter>
        </ModalContent>
    );
}

export default AddNewVolumesModalContent;
