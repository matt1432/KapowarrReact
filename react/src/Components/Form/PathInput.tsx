// IMPORTS

// React
import { type KeyboardEvent, type SyntheticEvent, useCallback, useEffect, useState } from 'react';

// Redux
import { useDispatch /*, useSelector */ } from 'react-redux';
// import { createSelector } from 'reselect';
// import { clearPaths, fetchPaths } from 'Store/Actions/pathActions';

// Misc
import { icons } from 'Helpers/Props';

import classNames from 'classnames';
import usePrevious from 'Helpers/Hooks/usePrevious';

// General Components
import FileBrowserModal from 'Components/FileBrowser/FileBrowserModal';
import Icon from 'Components/Icon';

// Specific Components
import AutoSuggestInput from './AutoSuggestInput';
import FormInputButton from './FormInputButton';

// CSS
import styles from './PathInput.module.css';

// Types
import type { ChangeEvent, SuggestionsFetchRequestedParams } from 'react-autosuggest';
import type { InputChanged } from 'typings/inputs';

// eslint-disable-next-line
type Path = any;

export interface PathInputProps {
    className?: string;
    name: string;
    value?: string;
    placeholder?: string;
    includeFiles: boolean;
    hasButton?: boolean;
    hasFileBrowser?: boolean;
    onChange: (change: InputChanged<string>) => void;
}

interface PathInputInternalProps extends PathInputProps {
    // eslint-disable-next-line
    paths: any[]; // Path[];
    onFetchPaths: (path: string) => void;
    onClearPaths: () => void;
}

// IMPLEMENTATIONS

function handleSuggestionsClearRequested() {
    // Required because props aren't always rendered, but no-op
    // because we don't want to reset the paths after a path is selected.
}

/*
function createPathsSelector() {
    return createSelector(
        (state: AppState) => state.paths,
        (paths) => {
            const { currentPath, directories, files } = paths;

            const filteredPaths = [...directories, ...files].filter(({ path }) => {
                return path.toLowerCase().startsWith(currentPath.toLowerCase());
            });

            return filteredPaths;
        },
    );
}
*/

function PathInput(props: PathInputProps) {
    const { includeFiles } = props;

    const dispatch = useDispatch();

    // const paths = useSelector(createPathsSelector());
    // @ts-expect-error TODO:
    const paths = [];

    const handleFetchPaths = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (path: string) => {
            // dispatch(fetchPaths({ path, includeFiles }));
        },
        [includeFiles, dispatch],
    );

    const handleClearPaths = useCallback(() => {
        // dispatch(clearPaths);
    }, [dispatch]);

    return (
        <PathInputInternal
            {...props}
            // @ts-expect-error TODO:
            paths={paths}
            onFetchPaths={handleFetchPaths}
            onClearPaths={handleClearPaths}
        />
    );
}

export default PathInput;

export function PathInputInternal(props: PathInputInternalProps) {
    const {
        className = styles.inputWrapper,
        name,
        value: inputValue = '',
        paths,
        includeFiles,
        hasButton,
        hasFileBrowser = true,
        onChange,
        onClearPaths,
        ...otherProps
    } = props;

    const [value, setValue] = useState(inputValue);
    const [isFileBrowserModalOpen, setIsFileBrowserModalOpen] = useState(false);
    const previousInputValue = usePrevious(inputValue);
    const dispatch = useDispatch();

    const handleFetchPaths = useCallback(
        // @ts-expect-error TODO:
        // eslint-disable-next-line
        (path: string) => {
            // dispatch(fetchPaths({ path, includeFiles }));
        },
        [includeFiles, dispatch],
    );

    const handleInputChange = useCallback(
        (_event: SyntheticEvent, { newValue }: ChangeEvent) => {
            setValue(newValue);
        },
        [setValue],
    );

    const handleInputKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                const path = paths[0];

                if (path) {
                    onChange({
                        name,
                        value: path.path,
                    });

                    if (path.type !== 'file') {
                        handleFetchPaths(path.path);
                    }
                }
            }
        },
        [name, paths, handleFetchPaths, onChange],
    );
    const handleInputBlur = useCallback(() => {
        onChange({
            name,
            value,
        });

        onClearPaths();
    }, [name, value, onClearPaths, onChange]);

    const handleSuggestionSelected = useCallback(
        (_event: SyntheticEvent, { suggestion }: { suggestion: Path }) => {
            handleFetchPaths(suggestion.path);
        },
        [handleFetchPaths],
    );

    const handleSuggestionsFetchRequested = useCallback(
        ({ value: newValue }: SuggestionsFetchRequestedParams) => {
            handleFetchPaths(newValue);
        },
        [handleFetchPaths],
    );

    const handleFileBrowserOpenPress = useCallback(() => {
        setIsFileBrowserModalOpen(true);
    }, [setIsFileBrowserModalOpen]);

    const handleFileBrowserModalClose = useCallback(() => {
        setIsFileBrowserModalOpen(false);
    }, [setIsFileBrowserModalOpen]);

    const handleChange = useCallback(
        (change: InputChanged<Path>) => {
            onChange({ name, value: change.value.path });
        },
        [name, onChange],
    );

    const getSuggestionValue = useCallback(({ path }: Path) => path, []);

    const renderSuggestion = useCallback(({ path }: Path, { query }: { query: string }) => {
        const lastSeparatorIndex = query.lastIndexOf('\\') || query.lastIndexOf('/');

        if (lastSeparatorIndex === -1) {
            return <span>{path}</span>;
        }

        return (
            <span>
                <span className={styles.pathMatch}>{path.substring(0, lastSeparatorIndex)}</span>
                {path.substring(lastSeparatorIndex)}
            </span>
        );
    }, []);

    useEffect(() => {
        if (inputValue !== previousInputValue) {
            setValue(inputValue);
        }
    }, [inputValue, previousInputValue, setValue]);

    return (
        <div className={className}>
            <AutoSuggestInput
                {...otherProps}
                className={hasFileBrowser ? styles.hasFileBrowser : undefined}
                name={name}
                value={value}
                suggestions={paths}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                onInputKeyDown={handleInputKeyDown}
                onInputChange={handleInputChange}
                onInputBlur={handleInputBlur}
                onSuggestionSelected={handleSuggestionSelected}
                onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={handleSuggestionsClearRequested}
                onChange={handleChange}
            />

            {hasFileBrowser ? (
                <>
                    <FormInputButton
                        className={classNames(
                            styles.fileBrowserButton,
                            hasButton && styles.fileBrowserMiddleButton,
                        )}
                        onPress={handleFileBrowserOpenPress}
                    >
                        <Icon name={icons.FOLDER_OPEN} />
                    </FormInputButton>

                    <FileBrowserModal
                        isOpen={isFileBrowserModalOpen}
                        name={name}
                        value={value}
                        includeFiles={includeFiles}
                        onChange={onChange}
                        onModalClose={handleFileBrowserModalClose}
                    />
                </>
            ) : null}
        </div>
    );
}
