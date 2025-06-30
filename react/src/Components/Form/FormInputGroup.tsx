import React, { type ElementType, type ReactNode } from 'react';
import Link from 'Components/Link/Link';
import { inputTypes } from 'Helpers/Props';
import { type InputType } from 'Helpers/Props/inputTypes';
import { type Failure, type ValidationError, type ValidationWarning } from 'typings/pending';
import translate from 'Utilities/String/translate';
import AutoCompleteInput, { type AutoCompleteInputProps } from './AutoCompleteInput';
import CheckInput, { type CheckInputProps } from './CheckInput';
import { type FormInputButtonProps } from './FormInputButton';
import FormInputHelpText from './FormInputHelpText';
import KeyValueListInput, { type KeyValueListInputProps } from './KeyValueListInput';
import NumberInput, { type NumberInputProps } from './NumberInput';
import OAuthInput, { type OAuthInputProps } from './OAuthInput';
import PasswordInput from './PasswordInput';
import PathInput, { type PathInputProps } from './PathInput';
import DownloadClientSelectInput, {
    type DownloadClientSelectInputProps,
} from './Select/DownloadClientSelectInput';
import EnhancedSelectInput, { type EnhancedSelectInputProps } from './Select/EnhancedSelectInput';
import IndexerFlagsSelectInput, {
    type IndexerFlagsSelectInputProps,
} from './Select/IndexerFlagsSelectInput';
import IndexerSelectInput, { type IndexerSelectInputProps } from './Select/IndexerSelectInput';
import LanguageSelectInput, { type LanguageSelectInputProps } from './Select/LanguageSelectInput';
import MonitorIssuesSelectInput, {
    type MonitorIssuesSelectInputProps,
} from './Select/MonitorIssuesSelectInput';
import MonitorNewItemsSelectInput, {
    type MonitorNewItemsSelectInputProps,
} from './Select/MonitorNewItemsSelectInput';
import ProviderDataSelectInput, {
    type ProviderOptionSelectInputProps,
} from './Select/ProviderOptionSelectInput';
import QualityProfileSelectInput, {
    type QualityProfileSelectInputProps,
} from './Select/QualityProfileSelectInput';
import RootFolderSelectInput, {
    type RootFolderSelectInputProps,
} from './Select/RootFolderSelectInput';
import VolumesTypeSelectInput, {
    type VolumesTypeSelectInputProps,
} from './Select/VolumesTypeSelectInput';
import UMaskInput, { type UMaskInputProps } from './Select/UMaskInput';
import DeviceInput, { type DeviceInputProps } from './Tag/DeviceInput';
import VolumesTagInput, { type VolumesTagInputProps } from './Tag/VolumesTagInput';
import TagSelectInput, { type TagSelectInputProps } from './Tag/TagSelectInput';
import TextTagInput, { type TextTagInputProps } from './Tag/TextTagInput';
import TextArea, { type TextAreaProps } from './TextArea';
import TextInput, { type TextInputProps } from './TextInput';
import styles from './FormInputGroup.module.css';

const componentMap: Record<InputType, ElementType> = {
    autoComplete: AutoCompleteInput,
    check: CheckInput,
    date: TextInput,
    device: DeviceInput,
    downloadClientSelect: DownloadClientSelectInput,
    dynamicSelect: ProviderDataSelectInput,
    file: TextInput,
    float: NumberInput,
    indexerFlagsSelect: IndexerFlagsSelectInput,
    indexerSelect: IndexerSelectInput,
    keyValueList: KeyValueListInput,
    languageSelect: LanguageSelectInput,
    monitorIssuesSelect: MonitorIssuesSelectInput,
    monitorNewItemsSelect: MonitorNewItemsSelectInput,
    number: NumberInput,
    oauth: OAuthInput,
    password: PasswordInput,
    path: PathInput,
    qualityProfileSelect: QualityProfileSelectInput,
    rootFolderSelect: RootFolderSelectInput,
    select: EnhancedSelectInput,
    volumesTag: VolumesTagInput,
    volumesTypeSelect: VolumesTypeSelectInput,
    tag: VolumesTagInput,
    tagSelect: TagSelectInput,
    text: TextInput,
    textArea: TextArea,
    textTag: TextTagInput,
    umask: UMaskInput,
} as const;

type PickProps<V, C extends InputType> = C extends 'text'
    ? TextInputProps
    : C extends 'autoComplete'
      ? AutoCompleteInputProps
      : C extends 'check'
        ? CheckInputProps
        : C extends 'date'
          ? TextInputProps
          : C extends 'device'
            ? DeviceInputProps
            : C extends 'downloadClientSelect'
              ? DownloadClientSelectInputProps
              : C extends 'dynamicSelect'
                ? ProviderOptionSelectInputProps
                : C extends 'file'
                  ? TextInputProps
                  : C extends 'float'
                    ? TextInputProps
                    : C extends 'indexerFlagsSelect'
                      ? IndexerFlagsSelectInputProps
                      : C extends 'indexerSelect'
                        ? IndexerSelectInputProps
                        : C extends 'keyValueList'
                          ? KeyValueListInputProps
                          : C extends 'languageSelect'
                            ? LanguageSelectInputProps
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
                                        : C extends 'qualityProfileSelect'
                                          ? QualityProfileSelectInputProps
                                          : C extends 'rootFolderSelect'
                                            ? RootFolderSelectInputProps
                                            : C extends 'select'
                                              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                EnhancedSelectInputProps<any, V>
                                              : C extends 'volumesTag'
                                                ? VolumesTagInputProps<V>
                                                : C extends 'volumesTypeSelect'
                                                  ? VolumesTypeSelectInputProps
                                                  : C extends 'tag'
                                                    ? VolumesTagInputProps<V>
                                                    : C extends 'tagSelect'
                                                      ? TagSelectInputProps
                                                      : C extends 'text'
                                                        ? TextInputProps
                                                        : C extends 'textArea'
                                                          ? TextAreaProps
                                                          : C extends 'textTag'
                                                            ? TextTagInputProps
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
