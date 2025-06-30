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
// import { queueLookupComics, setImportComicsValue } from 'Store/Actions/importComicsActions';
import createImportComicsItemSelector from 'Store/Selectors/createImportComicsItemSelector';
import { type InputChanged } from 'typings/inputs';
import getErrorMessage from 'Utilities/Object/getErrorMessage';
import translate from 'Utilities/String/translate';
import ImportComicsSearchResult from './ImportComicsSearchResult';
import ImportComicsTitle from './ImportComicsTitle';
import styles from './ImportComicsSelectComics.module.css';

interface ImportComicsSelectComicsProps {
    id: string;
    onInputChange: (input: InputChanged) => void;
}

function ImportComicsSelectComics({ id, onInputChange }: ImportComicsSelectComicsProps) {
    const dispatch = useDispatch();
    const isLookingUpComics = useSelector(
        (state: AppState) => state.importComics.isLookingUpComics,
    );

    const {
        error,
        isFetching = true,
        isPopulated = false,
        items = [],
        isQueued = true,
        selectedComics,
        isExistingComics,
        term: itemTerm,
        // @ts-expect-error - ignoring this for now
    } = useSelector(createImportComicsItemSelector(id, { id }));

    const comicsLookupTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [term, setTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const errorMessage = getErrorMessage(error);

    const handlePress = useCallback(() => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    }, []);

    const handleSearchInputChange = useCallback(
        ({ value }: InputChanged<string>) => {
            if (comicsLookupTimeout.current) {
                clearTimeout(comicsLookupTimeout.current);
            }

            setTerm(value);

            comicsLookupTimeout.current = setTimeout(() => {
                /*
                dispatch(
                    queueLookupComics({
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
            queueLookupComics({
                name: id,
                term,
                topOfQueue: true,
            }),
        );*/
    }, [id, term, dispatch]);

    const handleComicsSelect = useCallback(
        (tvdbId: number) => {
            setIsOpen(false);

            const selectedComics = items.find((item) => item.tvdbId === tvdbId)!;

            dispatch(
                // @ts-expect-error - actions are not typed
                setImportComicsValue({
                    id,
                    selectedComics,
                }),
            );

            if (selectedComics.comicsType !== 'standard') {
                onInputChange({
                    name: 'comicsType',
                    value: selectedComics.comicsType,
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
                    {isLookingUpComics && isQueued && !isPopulated ? (
                        <LoadingIndicator className={styles.loading} size={20} />
                    ) : null}

                    {isPopulated && selectedComics && isExistingComics ? (
                        <Icon
                            className={styles.warningIcon}
                            name={icons.WARNING}
                            kind={kinds.WARNING}
                        />
                    ) : null}

                    {isPopulated && selectedComics ? (
                        <ImportComicsTitle
                            title={selectedComics.title}
                            year={selectedComics.year}
                            network={selectedComics.network}
                            isExistingComics={isExistingComics}
                        />
                    ) : null}

                    {isPopulated && !selectedComics ? (
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
                                            <ImportComicsSearchResult
                                                key={item.tvdbId}
                                                tvdbId={item.tvdbId}
                                                title={item.title}
                                                year={item.year}
                                                network={item.network}
                                                onPress={handleComicsSelect}
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

export default ImportComicsSelectComics;
