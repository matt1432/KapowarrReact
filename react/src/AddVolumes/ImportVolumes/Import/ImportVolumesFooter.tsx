import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    type AddVolumesOptions,
    setAddVolumesOption,
    useAddVolumesOptions,
} from 'AddVolumes/addVolumesOptionsStore';
import { useSelect } from 'App/SelectContext';
import { type AppState } from 'App/State/AppState';
import CheckInput from 'Components/Form/CheckInput';
import FormInputGroup from 'Components/Form/FormInputGroup';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import SpinnerButton from 'Components/Link/SpinnerButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContentFooter from 'Components/Page/PageContentFooter';
import Popover from 'Components/Tooltip/Popover';
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';
import type { VolumesMonitor, VolumesType } from 'Volumes/Volumes';
/*
import {
    cancelLookupVolumes,
    importVolumes,
    lookupUnsearchedVolumes,
    setImportVolumesValue,
} from 'Store/Actions/importVolumesActions';
*/
import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import styles from './ImportVolumesFooter.module.css';

type MixedType = 'mixed';

function ImportVolumesFooter() {
    const dispatch = useDispatch();
    const {
        monitor: defaultMonitor,
        qualityProfileId: defaultQualityProfileId,
        volumesType: defaultVolumesType,
        seasonFolder: defaultSeasonFolder,
    } = useAddVolumesOptions();

    const { isLookingUpVolumes, isImporting, items, importError } = useSelector(
        (state: AppState) => state.importVolumes,
    );

    const [monitor, setMonitor] = useState<VolumesMonitor | MixedType>(defaultMonitor);
    const [qualityProfileId, setQualityProfileId] = useState<number | MixedType>(
        defaultQualityProfileId,
    );
    const [volumesType, setVolumesType] = useState<VolumesType | MixedType>(defaultVolumesType);
    const [seasonFolder, setSeasonFolder] = useState<boolean | MixedType>(defaultSeasonFolder);

    const [selectState] = useSelect();

    const selectedIds = useMemo(() => {
        return getSelectedIds(selectState.selectedState, (id) => id);
    }, [selectState.selectedState]);

    const {
        hasUnsearchedItems,
        isMonitorMixed,
        isQualityProfileIdMixed,
        isVolumesTypeMixed,
        isSeasonFolderMixed,
    } = useMemo(() => {
        let isMonitorMixed = false;
        let isQualityProfileIdMixed = false;
        let isVolumesTypeMixed = false;
        let isSeasonFolderMixed = false;
        let hasUnsearchedItems = false;

        items.forEach((item) => {
            if (item.monitor !== defaultMonitor) {
                isMonitorMixed = true;
            }

            if (item.qualityProfileId !== defaultQualityProfileId) {
                isQualityProfileIdMixed = true;
            }

            if (item.volumesType !== defaultVolumesType) {
                isVolumesTypeMixed = true;
            }

            if (item.seasonFolder !== defaultSeasonFolder) {
                isSeasonFolderMixed = true;
            }

            if (!item.isPopulated) {
                hasUnsearchedItems = true;
            }
        });

        return {
            hasUnsearchedItems: !isLookingUpVolumes && hasUnsearchedItems,
            isMonitorMixed,
            isQualityProfileIdMixed,
            isVolumesTypeMixed,
            isSeasonFolderMixed,
        };
    }, [
        defaultMonitor,
        defaultQualityProfileId,
        defaultSeasonFolder,
        defaultVolumesType,
        items,
        isLookingUpVolumes,
    ]);

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged<string | number | boolean | number[]>) => {
            if (name === 'monitor') {
                setMonitor(value as VolumesMonitor);
            }
            else if (name === 'qualityProfileId') {
                setQualityProfileId(value as number);
            }
            else if (name === 'volumesType') {
                setVolumesType(value as VolumesType);
            }
            else if (name === 'seasonFolder') {
                setSeasonFolder(value as boolean);
            }

            setAddVolumesOption(name as keyof AddVolumesOptions, value);

            selectedIds.forEach((id) => {
                dispatch(
                    // @ts-expect-error - actions are not typed
                    setImportVolumesValue({
                        id,
                        [name]: value,
                    }),
                );
            });
        },
        [selectedIds, dispatch],
    );

    const handleLookupPress = useCallback(() => {
        // dispatch(lookupUnsearchedVolumes());
    }, [dispatch]);

    const handleCancelLookupPress = useCallback(() => {
        // dispatch(cancelLookupVolumes());
    }, [dispatch]);

    const handleImportPress = useCallback(() => {
        // dispatch(importVolumes({ ids: selectedIds }));
    }, [selectedIds, dispatch]);

    useEffect(() => {
        if (isMonitorMixed && monitor !== 'mixed') {
            setMonitor('mixed');
        }
        else if (!isMonitorMixed && monitor !== defaultMonitor) {
            setMonitor(defaultMonitor);
        }
    }, [defaultMonitor, isMonitorMixed, monitor]);

    useEffect(() => {
        if (isQualityProfileIdMixed && qualityProfileId !== 'mixed') {
            setQualityProfileId('mixed');
        }
        else if (!isQualityProfileIdMixed && qualityProfileId !== defaultQualityProfileId) {
            setQualityProfileId(defaultQualityProfileId);
        }
    }, [defaultQualityProfileId, isQualityProfileIdMixed, qualityProfileId]);

    useEffect(() => {
        if (isVolumesTypeMixed && volumesType !== 'mixed') {
            setVolumesType('mixed');
        }
        else if (!isVolumesTypeMixed && volumesType !== defaultVolumesType) {
            setVolumesType(defaultVolumesType);
        }
    }, [defaultVolumesType, isVolumesTypeMixed, volumesType]);

    useEffect(() => {
        if (isSeasonFolderMixed && seasonFolder !== 'mixed') {
            setSeasonFolder('mixed');
        }
        else if (!isSeasonFolderMixed && seasonFolder !== defaultSeasonFolder) {
            setSeasonFolder(defaultSeasonFolder);
        }
    }, [defaultSeasonFolder, isSeasonFolderMixed, seasonFolder]);

    const selectedCount = selectedIds.length;

    return (
        <PageContentFooter>
            <div className={styles.inputContainer}>
                <div className={styles.label}>{translate('Monitor')}</div>

                <FormInputGroup
                    type={inputTypes.MONITOR_ISSUES_SELECT}
                    name="monitor"
                    value={monitor}
                    isDisabled={!selectedCount}
                    includeMixed={isMonitorMixed}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.label}>{translate('QualityProfile')}</div>

                <FormInputGroup
                    type={inputTypes.QUALITY_PROFILE_SELECT}
                    name="qualityProfileId"
                    value={qualityProfileId}
                    isDisabled={!selectedCount}
                    includeMixed={isQualityProfileIdMixed}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.label}>{translate('VolumesType')}</div>

                <FormInputGroup
                    type={inputTypes.VOLUMES_TYPE_SELECT}
                    name="volumesType"
                    value={volumesType}
                    isDisabled={!selectedCount}
                    includeMixed={isVolumesTypeMixed}
                    onChange={handleInputChange}
                />
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.label}>{translate('SeasonFolder')}</div>

                <CheckInput
                    name="seasonFolder"
                    value={seasonFolder}
                    isDisabled={!selectedCount}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <div className={styles.label}>&nbsp;</div>

                <div className={styles.importButtonContainer}>
                    <SpinnerButton
                        className={styles.importButton}
                        kind={kinds.PRIMARY}
                        isSpinning={isImporting}
                        isDisabled={!selectedCount || isLookingUpVolumes}
                        onPress={handleImportPress}
                    >
                        {translate('ImportCountVolumes', { selectedCount })}
                    </SpinnerButton>

                    {isLookingUpVolumes ? (
                        <Button
                            className={styles.loadingButton}
                            kind={kinds.WARNING}
                            onPress={handleCancelLookupPress}
                        >
                            {translate('CancelProcessing')}
                        </Button>
                    ) : null}

                    {hasUnsearchedItems ? (
                        <Button
                            className={styles.loadingButton}
                            kind={kinds.SUCCESS}
                            onPress={handleLookupPress}
                        >
                            {translate('StartProcessing')}
                        </Button>
                    ) : null}

                    {isLookingUpVolumes ? (
                        <LoadingIndicator className={styles.loading} size={24} />
                    ) : null}

                    {isLookingUpVolumes ? translate('ProcessingFolders') : null}

                    {importError ? (
                        <Popover
                            anchor={
                                <Icon
                                    className={styles.importError}
                                    name={icons.WARNING}
                                    kind={kinds.WARNING}
                                />
                            }
                            title={translate('ImportErrors')}
                            body={
                                <ul>
                                    {Array.isArray(importError.responseJSON) ? (
                                        importError.responseJSON.map((error, index) => {
                                            return <li key={index}>{error.errorMessage}</li>;
                                        })
                                    ) : (
                                        <li>{JSON.stringify(importError.responseJSON)}</li>
                                    )}
                                </ul>
                            }
                            position={tooltipPositions.RIGHT}
                        />
                    ) : null}
                </div>
            </div>
        </PageContentFooter>
    );
}

export default ImportVolumesFooter;
