import {
    autoUpdate,
    flip,
    FloatingPortal,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
} from '@floating-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppState } from 'App/State/AppState';
import FormInputButton from 'Components/Form/FormInputButton';
import TextInput from 'Components/Form/TextInput';
import Icon from 'Components/Icon';
import Link from 'Components/Link/Link';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import { icons, kinds } from 'Helpers/Props';
// import { queueLookupVolumes, setImportVolumesValue } from 'Store/Actions/importVolumesActions';
import createImportVolumesItemSelector from 'Store/Selectors/createImportVolumesItemSelector';
import { type InputChanged } from 'typings/inputs';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import ImportVolumesSearchResult from './ImportVolumesSearchResult';
import ImportVolumesTitle from './ImportVolumesTitle';
import styles from './ImportVolumesSelectVolumes.module.css';

interface ImportVolumesSelectVolumesProps {
    id: string;
    onInputChange: (input: InputChanged) => void;
}

function ImportVolumesSelectVolumes({ id, onInputChange }: ImportVolumesSelectVolumesProps) {
    const dispatch = useDispatch();
    const isLookingUpVolumes = useSelector(
        (state: AppState) => state.importVolumes.isLookingUpVolumes,
    );

    const {
        error,
        isFetching = true,
        isPopulated = false,
        items = [],
        isQueued = true,
        selectedVolumes,
        isExistingVolumes,
        term: itemTerm,
        // @ts-expect-error - ignoring this for now
    } = useSelector(createImportVolumesItemSelector(id, { id }));

    const volumesLookupTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [term, setTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const errorMessage = getErrorMessage(error);

    const handlePress = useCallback(() => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    }, []);

    const handleSearchInputChange = useCallback(
        ({ value }: InputChanged<string>) => {
            if (volumesLookupTimeout.current) {
                clearTimeout(volumesLookupTimeout.current);
            }

            setTerm(value);

            volumesLookupTimeout.current = setTimeout(() => {
                /*
                dispatch(
                    queueLookupVolumes({
                        name: id,
                        term: value,
                        topOfQueue: true,
                    }),
                );
                */
            }, 200);
        },
        [id, dispatch],
    );

    const handleRefreshPress = useCallback(() => {
        /*
        dispatch(
            queueLookupVolumes({
                name: id,
                term,
                topOfQueue: true,
            }),
        );*/
    }, [id, term, dispatch]);

    const handleVolumesSelect = useCallback(
        (tvdbId: number) => {
            setIsOpen(false);

            const selectedVolumes = items.find((item) => item.tvdbId === tvdbId)!;

            dispatch(
                // @ts-expect-error - actions are not typed
                setImportVolumesValue({
                    id,
                    selectedVolumes,
                }),
            );

            if (selectedVolumes.volumesType !== 'standard') {
                onInputChange({
                    name: 'volumesType',
                    value: selectedVolumes.volumesType,
                });
            }
        },
        [id, items, dispatch, onInputChange],
    );

    useEffect(() => {
        setTerm(itemTerm);
    }, [itemTerm]);

    const { refs, context, floatingStyles } = useFloating({
        middleware: [
            flip({
                crossAxis: false,
                mainAxis: true,
            }),
        ],
        open: isOpen,
        placement: 'bottom',
        whileElementsMounted: autoUpdate,
        onOpenChange: setIsOpen,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    return (
        <>
            <div ref={refs.setReference} {...getReferenceProps()}>
                <Link className={styles.button} component="div" onPress={handlePress}>
                    {isLookingUpVolumes && isQueued && !isPopulated ? (
                        <LoadingIndicator className={styles.loading} size={20} />
                    ) : null}

                    {isPopulated && selectedVolumes && isExistingVolumes ? (
                        <Icon
                            className={styles.warningIcon}
                            name={icons.WARNING}
                            kind={kinds.WARNING}
                        />
                    ) : null}

                    {isPopulated && selectedVolumes ? (
                        <ImportVolumesTitle
                            title={selectedVolumes.title}
                            year={selectedVolumes.year}
                            network={selectedVolumes.network}
                            isExistingVolumes={isExistingVolumes}
                        />
                    ) : null}

                    {isPopulated && !selectedVolumes ? (
                        <div>
                            <Icon
                                className={styles.warningIcon}
                                name={icons.WARNING}
                                kind={kinds.WARNING}
                            />

                            {translate('NoMatchFound')}
                        </div>
                    ) : null}

                    {!isFetching && !!error ? (
                        <div>
                            <Icon
                                className={styles.warningIcon}
                                title={errorMessage}
                                name={icons.WARNING}
                                kind={kinds.WARNING}
                            />

                            {translate('SearchFailedError')}
                        </div>
                    ) : null}

                    <div className={styles.dropdownArrowContainer}>
                        <Icon name={icons.CARET_DOWN} />
                    </div>
                </Link>
            </div>
            {isOpen ? (
                <FloatingPortal id="portal-root">
                    <div
                        ref={refs.setFloating}
                        className={styles.contentContainer}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        {isOpen ? (
                            <div className={styles.content}>
                                <div className={styles.searchContainer}>
                                    <div className={styles.searchIconContainer}>
                                        <Icon name={icons.SEARCH} />
                                    </div>

                                    <TextInput
                                        className={styles.searchInput}
                                        name={`${name}_textInput`}
                                        value={term}
                                        onChange={handleSearchInputChange}
                                    />

                                    <FormInputButton
                                        kind={kinds.DEFAULT_KIND}
                                        spinnerIcon={icons.REFRESH}
                                        canSpin={true}
                                        isSpinning={isFetching}
                                        onPress={handleRefreshPress}
                                    >
                                        <Icon name={icons.REFRESH} />
                                    </FormInputButton>
                                </div>

                                <div className={styles.results}>
                                    {items.map((item) => {
                                        return (
                                            <ImportVolumesSearchResult
                                                key={item.tvdbId}
                                                tvdbId={item.tvdbId}
                                                title={item.title}
                                                year={item.year}
                                                network={item.network}
                                                onPress={handleVolumesSelect}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </FloatingPortal>
            ) : null}
        </>
    );
}

export default ImportVolumesSelectVolumes;
