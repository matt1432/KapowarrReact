// IMPORTS

// React
import React, { type ElementType, type ReactNode } from 'react';

// Misc
import { inputTypes } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Link from 'Components/Link/Link';

// Specific Components
import AutoCompleteInput, { type AutoCompleteInputProps } from './AutoCompleteInput';
import CheckInput, { type CheckInputProps } from './CheckInput';
import FormInputHelpText from './FormInputHelpText';
import KeyValueListInput, { type KeyValueListInputProps } from './KeyValueListInput';
import NumberInput, { type NumberInputProps } from './NumberInput';
import OAuthInput, { type OAuthInputProps } from './OAuthInput';
import PasswordInput from './PasswordInput';
import PathInput, { type PathInputProps } from './PathInput';
import TextArea, { type TextAreaProps } from './TextArea';
import TextInput, { type TextInputProps } from './TextInput';

import DownloadClientSelectInput from './Select/DownloadClientSelectInput';
import type { DownloadClientSelectInputProps } from './Select/DownloadClientSelectInput';

import EnhancedSelectInput from './Select/EnhancedSelectInput';
import type { EnhancedSelectInputProps } from './Select/EnhancedSelectInput';

import MonitorIssuesSelectInput from './Select/MonitorIssuesSelectInput';
import type { MonitorIssuesSelectInputProps } from './Select/MonitorIssuesSelectInput';

import MonitorNewItemsSelectInput from './Select/MonitorNewItemsSelectInput';
import type { MonitorNewItemsSelectInputProps } from './Select/MonitorNewItemsSelectInput';

import ProviderDataSelectInput from './Select/ProviderOptionSelectInput';
import type { ProviderOptionSelectInputProps } from './Select/ProviderOptionSelectInput';

import RootFolderSelectInput from './Select/RootFolderSelectInput';
import type { RootFolderSelectInputProps } from './Select/RootFolderSelectInput';

import SpecialVersionSelectInput from './Select/SpecialVersionSelectInput';
import type { SpecialVersionSelectInputProps } from './Select/SpecialVersionSelectInput';

import UMaskInput from './Select/UMaskInput';
import type { UMaskInputProps } from './Select/UMaskInput';

// CSS
import styles from './FormInputGroup.module.css';

// Types
import type { InputType } from 'Helpers/Props/inputTypes';
import type { Failure, ValidationError, ValidationWarning } from 'typings/pending';
import type { FormInputButtonProps } from './FormInputButton';

type PickProps<V, C extends InputType> = C extends 'text'
    ? TextInputProps
    : C extends 'autoComplete'
      ? AutoCompleteInputProps
      : C extends 'check'
        ? CheckInputProps
        : C extends 'date'
          ? TextInputProps
          : C extends 'downloadClientSelect'
            ? DownloadClientSelectInputProps
            : C extends 'dynamicSelect'
              ? ProviderOptionSelectInputProps
              : C extends 'file'
                ? TextInputProps
                : C extends 'float'
                  ? TextInputProps
                  : C extends 'keyValueList'
                    ? KeyValueListInputProps
                    : C extends 'monitorIssuesSelect'
                      ? MonitorIssuesSelectInputProps
                      : C extends 'monitorNewItemsSelect'
                        ? MonitorNewItemsSelectInputProps
                        : C extends 'number'
                          ? NumberInputProps
                          : C extends 'oauth'
                            ? OAuthInputProps
                            : C extends 'password'
                              ? TextInputProps
                              : C extends 'path'
                                ? PathInputProps
                                : C extends 'rootFolderSelect'
                                  ? RootFolderSelectInputProps
                                  : C extends 'select'
                                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      EnhancedSelectInputProps<any, V>
                                    : C extends 'specialVersionSelect'
                                      ? SpecialVersionSelectInputProps
                                      : C extends 'text'
                                        ? TextInputProps
                                        : C extends 'textArea'
                                          ? TextAreaProps
                                          : C extends 'umask'
                                            ? UMaskInputProps
                                            : never;

export interface FormInputGroupValues<T> {
    key: T;
    value: string;
    hint?: string;
}

// TODO: Remove once all parent components are updated to TSX and we can refactor to a consistent type
export interface ValidationMessage {
    message: string;
}

export type FormInputGroupProps<V, C extends InputType> = Omit<PickProps<V, C>, 'className'> & {
    type: C;
    className?: string;
    containerClassName?: string;
    inputClassName?: string;
    autoFocus?: boolean;
    autocomplete?: string;
    name: string;
    buttons?: ReactNode | ReactNode[];
    helpText?: string;
    helpTexts?: string[];
    helpTextWarning?: string;
    helpLink?: string;
    pending?: boolean;
    placeholder?: string;
    unit?: string;
    errors?: (ValidationMessage | ValidationError | Failure)[];
    warnings?: (ValidationMessage | ValidationWarning | Failure)[];
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
    oauth: OAuthInput,
    password: PasswordInput,
    path: PathInput,
    rootFolderSelect: RootFolderSelectInput,
    select: EnhancedSelectInput,
    specialVersionSelect: SpecialVersionSelectInput,
    text: TextInput,
    textArea: TextArea,
    umask: UMaskInput,
} as const;

function FormInputGroup<T, C extends InputType>(props: FormInputGroupProps<T, C>) {
    const {
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
    } = props;

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
                return 'errorMessage' in error ? (
                    <FormInputHelpText
                        key={index}
                        text={error.errorMessage}
                        link={error.infoLink}
                        tooltip={error.detailedDescription}
                        isError={true}
                        isCheckInput={checkInput}
                    />
                ) : (
                    <FormInputHelpText
                        key={index}
                        text={error.message}
                        isError={true}
                        isCheckInput={checkInput}
                    />
                );
            })}

            {warnings.map((warning, index) => {
                return 'errorMessage' in warning ? (
                    <FormInputHelpText
                        key={index}
                        text={warning.errorMessage}
                        link={warning.infoLink}
                        tooltip={warning.detailedDescription}
                        isWarning={true}
                        isCheckInput={checkInput}
                    />
                ) : (
                    <FormInputHelpText
                        key={index}
                        text={warning.message}
                        isWarning={true}
                        isCheckInput={checkInput}
                    />
                );
            })}
        </div>
    );
}

export default FormInputGroup;
