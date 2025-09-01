// IMPORTS

// React
import React, { type ElementType, type ReactNode } from 'react';

// Misc
import { inputTypes } from 'Helpers/Props';

import { getErrorMessage } from 'Utilities/Object/error';

import translate from 'Utilities/String/translate';

// General Components
import Link from 'Components/Link/Link';

// Specific Components
import AutoCompleteInput, { type AutoCompleteInputProps } from '../AutoCompleteInput';
import CheckInput, { type CheckInputProps } from '../CheckInput';
import FormInputHelpText from '../FormInputHelpText';
import KeyValueListInput, { type KeyValueListInputProps } from '../KeyValueListInput';
import NumberInput, { type NumberInputProps } from '../NumberInput';
import PasswordInput from '../PasswordInput';
import PathInput, { type PathInputProps } from '../PathInput';
import TextArea, { type TextAreaProps } from '../TextArea';
import TextInput, { type TextInputProps } from '../TextInput';

import DownloadClientSelectInput from '../Select/DownloadClientSelectInput';
import type { DownloadClientSelectInputProps } from '../Select/DownloadClientSelectInput';

import EnhancedSelectInput from '../Select/EnhancedSelectInput';
import type { EnhancedSelectInputProps } from '../Select/EnhancedSelectInput';

import MonitorIssuesSelectInput from '../Select/MonitorIssuesSelectInput';
import type { MonitorIssuesSelectInputProps } from '../Select/MonitorIssuesSelectInput';

import MonitorNewItemsSelectInput from '../Select/MonitorNewItemsSelectInput';
import type { MonitorNewItemsSelectInputProps } from '../Select/MonitorNewItemsSelectInput';

import ProviderDataSelectInput from '../Select/ProviderOptionSelectInput';
import type { ProviderOptionSelectInputProps } from '../Select/ProviderOptionSelectInput';

import RootFolderSelectInput from '../Select/RootFolderSelectInput';
import type { RootFolderSelectInputProps } from '../Select/RootFolderSelectInput';

import SpecialVersionSelectInput from '../Select/SpecialVersionSelectInput';
import type { SpecialVersionSelectInputProps } from '../Select/SpecialVersionSelectInput';

import UMaskInput from '../Select/UMaskInput';
import type { UMaskInputProps } from '../Select/UMaskInput';

// CSS
import styles from './index.module.css';

// Types
import type { InputType } from 'Helpers/Props/inputTypes';
import type { FormInputButtonProps } from '../FormInputButton';
import type { AnyError } from 'typings/Api';

type InputTypeMap<V, K extends string> = {
    text: TextInputProps<K, 'text'>;
    autoComplete: AutoCompleteInputProps<K>;
    check: CheckInputProps<K>;
    date: TextInputProps<K, 'date'>;
    downloadClientSelect: DownloadClientSelectInputProps<K>;
    dynamicSelect: ProviderOptionSelectInputProps<K>;
    file: TextInputProps<K, 'file'>;
    float: TextInputProps<K, 'number'>;
    keyValueList: KeyValueListInputProps<K>;
    monitorIssuesSelect: MonitorIssuesSelectInputProps<K>;
    monitorNewItemsSelect: MonitorNewItemsSelectInputProps<K>;
    number: NumberInputProps<K>;
    password: TextInputProps<K, 'password'>;
    path: PathInputProps<K>;
    rootFolderSelect: RootFolderSelectInputProps<K>;
    select: EnhancedSelectInputProps<K, any, V>; // eslint-disable-line @typescript-eslint/no-explicit-any
    specialVersionSelect: SpecialVersionSelectInputProps<K>;
    textArea: TextAreaProps<K>;
    umask: UMaskInputProps<K>;
};

type PickProps<V, C extends keyof InputTypeMap<V, K>, K extends string> = InputTypeMap<V, K>[C];

export interface FormInputGroupValues<T> {
    key: T;
    value: string;
    hint?: string;
}

export interface ValidationMessage {
    message: string;
}

export type FormInputGroupProps<V, C extends InputType, K extends string> = Omit<
    PickProps<V, C, K>,
    'className'
> & {
    type: C;
    className?: string;
    containerClassName?: string;
    inputClassName?: string;
    autoFocus?: boolean;
    autocomplete?: string;
    name: K;
    buttons?: ReactNode | ReactNode[];
    helpText?: string;
    helpTexts?: string[];
    helpTextWarning?: string;
    helpLink?: string;
    pending?: boolean;
    placeholder?: string;
    unit?: string;
    errors?: AnyError[];
    warnings?: AnyError[];
};

// IMPLEMENTATIONS

const componentMap: Record<InputType, ElementType> = {
    autoComplete: AutoCompleteInput,
    check: CheckInput,
    date: TextInput,
    downloadClientSelect: DownloadClientSelectInput,
    dynamicSelect: ProviderDataSelectInput,
    file: TextInput,
    float: NumberInput,
    keyValueList: KeyValueListInput,
    monitorIssuesSelect: MonitorIssuesSelectInput,
    monitorNewItemsSelect: MonitorNewItemsSelectInput,
    number: NumberInput,
    password: PasswordInput,
    path: PathInput,
    rootFolderSelect: RootFolderSelectInput,
    select: EnhancedSelectInput,
    specialVersionSelect: SpecialVersionSelectInput,
    text: TextInput,
    textArea: TextArea,
    umask: UMaskInput,
} as const;

function FormInputGroup<T, C extends InputType, K extends string>({
    className = styles.inputGroup,
    containerClassName = styles.inputGroupContainer,
    inputClassName,
    type,
    unit,
    buttons = [],
    helpText,
    helpTexts = [],
    helpTextWarning,
    helpLink,
    errors = [],
    warnings = [],
    ...otherProps
}: FormInputGroupProps<T, C, K>) {
    const InputComponent = componentMap[type];
    const checkInput = type === inputTypes.CHECK;
    const hasError = !!errors.length;
    const hasWarning = !hasError && !!warnings.length;
    const buttonsArray = React.Children.toArray(buttons);
    const lastButtonIndex = buttonsArray.length - 1;
    const hasButton = !!buttonsArray.length;

    return (
        <div className={containerClassName}>
            <div className={className}>
                <div className={styles.inputContainer}>
                    {/* @ts-expect-error - types are validated already */}
                    <InputComponent
                        className={inputClassName}
                        helpText={helpText}
                        helpTextWarning={helpTextWarning}
                        hasError={hasError}
                        hasWarning={hasWarning}
                        hasButton={hasButton}
                        {...otherProps}
                    />

                    {unit && (
                        <div
                            className={
                                type === inputTypes.NUMBER
                                    ? styles.inputUnitNumber
                                    : styles.inputUnit
                            }
                        >
                            {unit}
                        </div>
                    )}
                </div>

                {buttonsArray.map((button, index) => {
                    if (!React.isValidElement<FormInputButtonProps>(button)) {
                        return button;
                    }

                    return React.cloneElement(button, {
                        isLastButton: index === lastButtonIndex,
                    });
                })}
            </div>

            {!checkInput && helpText ? <FormInputHelpText text={helpText} /> : null}

            {!checkInput && helpTexts ? (
                <div>
                    {helpTexts.map((text, index) => {
                        return (
                            <FormInputHelpText key={index} text={text} isCheckInput={checkInput} />
                        );
                    })}
                </div>
            ) : null}

            {(!checkInput || helpText) && helpTextWarning ? (
                <FormInputHelpText text={helpTextWarning} isWarning={true} />
            ) : null}

            {helpLink ? <Link to={helpLink}>{translate('MoreInfo')}</Link> : null}

            {errors.map((error, index) => {
                return (
                    <FormInputHelpText
                        key={index}
                        text={getErrorMessage(error)}
                        isError={true}
                        isCheckInput={checkInput}
                    />
                );
            })}

            {warnings.map((warning, index) => {
                return (
                    <FormInputHelpText
                        key={index}
                        text={getErrorMessage(warning)}
                        isWarning={true}
                        isCheckInput={checkInput}
                    />
                );
            })}
        </div>
    );
}

export default FormInputGroup;
