import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    type AddComicsOptions,
    setAddComicsOption,
    useAddComicsOptions,
} from 'AddComics/addComicsOptionsStore';
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
import type { ComicsMonitor, ComicsType } from 'Comics/Comics';
/*
import {
    cancelLookupComics,
    importComics,
    lookupUnsearchedComics,
    setImportComicsValue,
} from 'Store/Actions/importComicsActions';
*/
import { type InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import getSelectedIds from 'Utilities/Table/getSelectedIds';
import styles from './ImportComicsFooter.module.css';

type MixedType = 'mixed';

function ImportComicsFooter() {
    const dispatch = useDispatch();
    const {
        monitor: defaultMonitor,
        qualityProfileId: defaultQualityProfileId,
        comicsType: defaultComicsType,
        seasonFolder: defaultSeasonFolder,
    } = useAddComicsOptions();

    const { isLookingUpComics, isImporting, items, importError } = useSelector(
        (state: AppState) => state.importComics,
    );

    const [monitor, setMonitor] = useState<ComicsMonitor | MixedType>(defaultMonitor);
    const [qualityProfileId, setQualityProfileId] = useState<number | MixedType>(
        defaultQualityProfileId,
    );
    const [comicsType, setComicsType] = useState<ComicsType | MixedType>(defaultComicsType);
    const [seasonFolder, setSeasonFolder] = useState<boolean | MixedType>(defaultSeasonFolder);

    const [selectState] = useSelect();

    const selectedIds = useMemo(() => {
        return getSelectedIds(selectState.selectedState, (id) => id);
    }, [selectState.selectedState]);

    const {
        hasUnsearchedItems,
        isMonitorMixed,
        isQualityProfileIdMixed,
        isComicsTypeMixed,
        isSeasonFolderMixed,
    } = useMemo(() => {
        let isMonitorMixed = false;
        let isQualityProfileIdMixed = false;
        let isComicsTypeMixed = false;
        let isSeasonFolderMixed = false;
        let hasUnsearchedItems = false;

        items.forEach((item) => {
            if (item.monitor !== defaultMonitor) {
                isMonitorMixed = true;
            }

            if (item.qualityProfileId !== defaultQualityProfileId) {
                isQualityProfileIdMixed = true;
            }

            if (item.comicsType !== defaultComicsType) {
                isComicsTypeMixed = true;
            }

            if (item.seasonFolder !== defaultSeasonFolder) {
                isSeasonFolderMixed = true;
            }

            if (!item.isPopulated) {
                hasUnsearchedItems = true;
            }
        });

        return {
            hasUnsearchedItems: !isLookingUpComics && hasUnsearchedItems,
            isMonitorMixed,
            isQualityProfileIdMixed,
            isComicsTypeMixed,
            isSeasonFolderMixed,
        };
    }, [
        defaultMonitor,
        defaultQualityProfileId,
        defaultSeasonFolder,
        defaultComicsType,
        items,
        isLookingUpComics,
    ]);

    const handleInputChange = useCallback(
        ({ name, value }: InputChanged<string | number | boolean | number[]>) => {
            if (name === 'monitor') {
                setMonitor(value as ComicsMonitor);
            }
            else if (name === 'qualityProfileId') {
                setQualityProfileId(value as number);
            }
            else if (name === 'comicsType') {
                setComicsType(value as ComicsType);
            }
            else if (name === 'seasonFolder') {
                setSeasonFolder(value as boolean);
            }

            setAddComicsOption(name as keyof AddComicsOptions, value);

            selectedIds.forEach((id) => {
                dispatch(
                    // @ts-expect-error - actions are not typed
                    setImportComicsValue({
                        id,
                        [name]: value,
                    }),
                );
            });
        },
        [selectedIds, dispatch],
    );

    const handleLookupPress = useCallback(() => {
        // dispatch(lookupUnsearchedComics());
    }, [dispatch]);

    const handleCancelLookupPress = useCallback(() => {
        // dispatch(cancelLookupComics());
    }, [dispatch]);

    const handleImportPress = useCallback(() => {
        // dispatch(importComics({ ids: selectedIds }));
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
        if (isComicsTypeMixed && comicsType !== 'mixed') {
            setComicsType('mixed');
        }
        else if (!isComicsTypeMixed && comicsType !== defaultComicsType) {
            setComicsType(defaultComicsType);
        }
    }, [defaultComicsType, isComicsTypeMixed, comicsType]);

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
                <div className={styles.label}>{translate('ComicsType')}</div>

                <FormInputGroup
                    type={inputTypes.COMICS_TYPE_SELECT}
                    name="comicsType"
                    value={comicsType}
                    isDisabled={!selectedCount}
                    includeMixed={isComicsTypeMixed}
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
                        isDisabled={!selectedCount || isLookingUpComics}
                        onPress={handleImportPress}
                    >
                        {translate('ImportCountComics', { selectedCount })}
                    </SpinnerButton>

                    {isLookingUpComics ? (
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

                    {isLookingUpComics ? (
                        <LoadingIndicator className={styles.loading} size={24} />
                    ) : null}

                    {isLookingUpComics ? translate('ProcessingFolders') : null}

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

export default ImportComicsFooter;
