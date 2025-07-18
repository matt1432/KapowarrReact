// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';

// Redux
import { useDispatch /*, useSelector*/ } from 'react-redux';
/*
import {
    cancelLookupVolume,
    importVolume,
    lookupUnsearchedVolume,
    setImportVolumeValue,
} from 'Store/Actions/importVolumeActions';
*/

// Misc
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';

import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';

// General Components
import { useSelect } from 'App/SelectContext';

import FormInputGroup from 'Components/Form/FormInputGroup';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import SpinnerButton from 'Components/Link/SpinnerButton';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContentFooter from 'Components/Page/PageContentFooter';
import Popover from 'Components/Tooltip/Popover';

// Specific Components

// CSS
import styles from './ImportVolumeFooter.module.css';

// Types
// import type { VolumeMonitor, VolumeType } from 'Volume/Volume';
import type { InputChanged } from 'typings/inputs';

type MixedType = 'mixed';

// IMPLEMENTATIONS

function ImportVolumeFooter() {
    const dispatch = useDispatch();
    const {
        monitor: defaultMonitor,
        qualityProfileId: defaultQualityProfileId,
        volumeType: defaultVolumeType,
    } = {
        monitor: '',
        qualityProfileId: 0,
        volumeType: '',
    }; // useAddVolumeOptions();

    /*const { isLookingUpVolume, isImporting, items, importError } = useSelector(
        (state: AppState) => state.importVolume,
    );*/
    const isLookingUpVolume = false;
    const isImporting = false;
    // @ts-expect-error TODO
    const items = [];
    const importError = undefined;

    const [monitor, setMonitor] = useState<string /*VolumeMonitor | MixedType*/>(defaultMonitor);
    const [qualityProfileId, setQualityProfileId] = useState<number | MixedType>(
        defaultQualityProfileId,
    );
    const [volumeType, setVolumeType] =
        useState<string /*VolumeType | MixedType*/>(defaultVolumeType);

    const [selectState] = useSelect();

    const selectedIds = useMemo(() => {
        return getSelectedIds(selectState.selectedState, (id) => id);
    }, [selectState.selectedState]);

    const { hasUnsearchedItems, isMonitorMixed, isQualityProfileIdMixed, isVolumeTypeMixed } =
        useMemo(() => {
            let isMonitorMixed = false;
            let isQualityProfileIdMixed = false;
            let isVolumeTypeMixed = false;
            let hasUnsearchedItems = false;

            // @ts-expect-error TODO
            items.forEach((item) => {
                if (item.monitor !== defaultMonitor) {
                    isMonitorMixed = true;
                }

                if (item.qualityProfileId !== defaultQualityProfileId) {
                    isQualityProfileIdMixed = true;
                }

                if (item.volumeType !== defaultVolumeType) {
                    isVolumeTypeMixed = true;
                }

                if (!item.isPopulated) {
                    hasUnsearchedItems = true;
                }
            });

            return {
                hasUnsearchedItems: !isLookingUpVolume && hasUnsearchedItems,
                isMonitorMixed,
                isQualityProfileIdMixed,
                isVolumeTypeMixed,
            };
        }, [
            defaultMonitor,
            defaultQualityProfileId,
            defaultVolumeType,
            // @ts-expect-error TODO
            items,
            isLookingUpVolume,
        ]);

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged<string | number | boolean | number[]>) => {
            if (name === 'monitor') {
                setMonitor(value as string); // as VolumeMonitor);
            }
            else if (name === 'qualityProfileId') {
                setQualityProfileId(value as number);
            }
            else if (name === 'volumeType') {
                setVolumeType(value as string); // as VolumeType);
            }

            // setAddVolumeOption(name as keyof AddVolumeOptions, value);

            selectedIds.forEach((id) => {
                dispatch(
                    // @ts-expect-error - actions are not typed
                    setImportVolumeValue({
                        id,
                        [name]: value,
                    }),
                );
            });
        },
        [selectedIds, dispatch],
    );

    const handleLookupPress = useCallback(() => {
        // dispatch(lookupUnsearchedVolume());
    }, [dispatch]);

    const handleCancelLookupPress = useCallback(() => {
        // dispatch(cancelLookupVolume());
    }, [dispatch]);

    const handleImportPress = useCallback(() => {
        // dispatch(importVolume({ ids: selectedIds }));
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
        if (isVolumeTypeMixed && volumeType !== 'mixed') {
            setVolumeType('mixed');
        }
        else if (!isVolumeTypeMixed && volumeType !== defaultVolumeType) {
            setVolumeType(defaultVolumeType);
        }
    }, [defaultVolumeType, isVolumeTypeMixed, volumeType]);

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
                <div className={styles.label}>{translate('VolumeType')}</div>

                <FormInputGroup
                    type={inputTypes.VOLUME_TYPE_SELECT}
                    name="volumeType"
                    value={volumeType}
                    isDisabled={!selectedCount}
                    includeMixed={isVolumeTypeMixed}
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
                        isDisabled={!selectedCount || isLookingUpVolume}
                        onPress={handleImportPress}
                    >
                        {translate('ImportCountVolume', { selectedCount })}
                    </SpinnerButton>

                    {isLookingUpVolume ? (
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

                    {isLookingUpVolume ? (
                        <LoadingIndicator className={styles.loading} size={24} />
                    ) : null}

                    {isLookingUpVolume ? translate('ProcessingFolders') : null}

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
                                <></> /*
                                <ul>
                                    {Array.isArray(importError.responseJSON) ? (
                                        importError.responseJSON.map((error, index) => {
                                            return <li key={index}>{error.errorMessage}</li>;
                                        })
                                    ) : (
                                        <li>{JSON.stringify(importError.responseJSON)}</li>
                                    )}
                                </ul>
                            */
                            }
                            position={tooltipPositions.RIGHT}
                        />
                    ) : null}
                </div>
            </div>
        </PageContentFooter>
    );
}

export default ImportVolumeFooter;
