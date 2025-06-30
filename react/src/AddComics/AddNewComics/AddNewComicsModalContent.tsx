import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { type AddComics } from 'AddComics/AddComics';
import {
    type AddComicsOptions,
    setAddComicsOption,
    useAddComicsOptions,
} from 'AddComics/addComicsOptionsStore';
import ComicsMonitoringOptionsPopoverContent from 'AddComics/ComicsMonitoringOptionsPopoverContent';
import ComicsTypePopoverContent from 'AddComics/ComicsTypePopoverContent';
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
import { type ComicsType } from 'Comics/Comics';
import ComicsPoster from 'Comics/ComicsPoster';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import selectSettings from 'Store/Selectors/selectSettings';
import useIsWindows from 'System/useIsWindows';
import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import { useAddComics } from './useAddComics';
import styles from './AddNewComicsModalContent.module.css';

export interface AddNewComicsModalContentProps {
    comics: AddComics;
    initialComicsType: ComicsType;
    onModalClose: () => void;
}

function AddNewComicsModalContent({
    comics,
    initialComicsType,
    onModalClose,
}: AddNewComicsModalContentProps) {
    const { title, year, overview, images, folder } = comics;
    const options = useAddComicsOptions();
    const { isSmallScreen } = useSelector(createDimensionsSelector());
    const isWindows = useIsWindows();

    const { isPending: isAdding, error: addError, mutate: addComics } = useAddComics();

    const { settings, validationErrors, validationWarnings } = useMemo(() => {
        return selectSettings(options, {}, addError);
    }, [options, addError]);

    const [comicsType, setComicsType] = useState<ComicsType>(
        initialComicsType === 'standard' ? settings.comicsType.value : initialComicsType,
    );

    const {
        monitor,
        qualityProfileId,
        rootFolderPath,
        searchForCutoffUnmetIssues,
        searchForMissingIssues,
        seasonFolder,
        comicsType: comicsTypeSetting,
        tags,
    } = settings;

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged<string | number | boolean | number[]>) => {
            setAddComicsOption(name as keyof AddComicsOptions, value);
        },
        [],
    );

    const handleQualityProfileIdChange = useCallback(({ value }: InputChanged<string | number>) => {
        setAddComicsOption('qualityProfileId', value as number);
    }, []);

    const handleAddComicsPress = useCallback(() => {
        addComics({
            ...comics,
            rootFolderPath: rootFolderPath.value,
            monitor: monitor.value,
            qualityProfileId: qualityProfileId.value,
            comicsType,
            seasonFolder: seasonFolder.value,
            searchForMissingIssues: searchForMissingIssues.value,
            searchForCutoffUnmetIssues: searchForCutoffUnmetIssues.value,
            tags: tags.value,
        });
    }, [
        comics,
        comicsType,
        rootFolderPath,
        monitor,
        qualityProfileId,
        seasonFolder,
        searchForMissingIssues,
        searchForCutoffUnmetIssues,
        tags,
        addComics,
    ]);

    useEffect(() => {
        setComicsType(comicsTypeSetting.value);
    }, [comicsTypeSetting]);

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
                            <ComicsPoster className={styles.poster} images={images} size={250} />
                        </div>
                    )}

                    <div className={styles.info}>
                        {overview ? <div className={styles.overview}>{overview}</div> : null}

                        <Form
                            validationErrors={validationErrors}
                            validationWarnings={validationWarnings}
                        >
                            <FormGroup>
                                <FormLabel>{translate('RootFolder')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.ROOT_FOLDER_SELECT}
                                    name="rootFolderPath"
                                    valueOptions={{
                                        comicsFolder: folder,
                                        isWindows,
                                    }}
                                    selectedValueOptions={{
                                        comicsFolder: folder,
                                        isWindows,
                                    }}
                                    helpText={translate('AddNewComicsRootFolderHelpText', {
                                        folder,
                                    })}
                                    onChange={handleInputChange}
                                    {...rootFolderPath}
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
                                        body={<ComicsMonitoringOptionsPopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.MONITOR_ISSUES_SELECT}
                                    name="monitor"
                                    onChange={handleInputChange}
                                    {...monitor}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>{translate('QualityProfile')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.QUALITY_PROFILE_SELECT}
                                    name="qualityProfileId"
                                    onChange={handleQualityProfileIdChange}
                                    {...qualityProfileId}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>
                                    {translate('ComicsType')}

                                    <Popover
                                        anchor={
                                            <Icon className={styles.labelIcon} name={icons.INFO} />
                                        }
                                        title={translate('ComicsTypes')}
                                        body={<ComicsTypePopoverContent />}
                                        position={tooltipPositions.RIGHT}
                                    />
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.COMICS_TYPE_SELECT}
                                    name="comicsType"
                                    onChange={handleInputChange}
                                    {...comicsTypeSetting}
                                    value={comicsType}
                                    helpText={translate('ComicsTypesHelpText')}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>{translate('SeasonFolder')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.CHECK}
                                    name="seasonFolder"
                                    onChange={handleInputChange}
                                    {...seasonFolder}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>{translate('Tags')}</FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TAG}
                                    name="tags"
                                    onChange={handleInputChange}
                                    {...tags}
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
                            {translate('AddNewComicsSearchForMissingIssues')}
                        </span>

                        <CheckInput
                            containerClassName={styles.searchInputContainer}
                            className={styles.searchInput}
                            name="searchForMissingIssues"
                            onChange={handleInputChange}
                            {...searchForMissingIssues}
                        />
                    </label>

                    <label className={styles.searchLabelContainer}>
                        <span className={styles.searchLabel}>
                            {translate('AddNewComicsSearchForCutoffUnmetIssues')}
                        </span>

                        <CheckInput
                            containerClassName={styles.searchInputContainer}
                            className={styles.searchInput}
                            name="searchForCutoffUnmetIssues"
                            onChange={handleInputChange}
                            {...searchForCutoffUnmetIssues}
                        />
                    </label>
                </div>

                <SpinnerButton
                    className={styles.addButton}
                    kind={kinds.SUCCESS}
                    isSpinning={isAdding}
                    onPress={handleAddComicsPress}
                >
                    {translate('AddComicsWithTitle', { title })}
                </SpinnerButton>
            </ModalFooter>
        </ModalContent>
    );
}

export default AddNewComicsModalContent;
