// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { inputTypes, kinds, scrollDirections } from 'Helpers/Props';

import translate, { type TranslateKey } from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// CSS
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/Inputs';

export interface SelectStringValueModalContentProps {
    initialValue: string;
    valueTitleKey: TranslateKey;
    confirmKey: TranslateKey;
    modalTitleKey: TranslateKey;
    modalTitle: string;
    onValueSelect(value: string): void;
    onModalClose(): void;
}

export default function SelectStringValueModalContent({
    initialValue,
    valueTitleKey,
    confirmKey,
    modalTitleKey,
    modalTitle,
    onValueSelect,
    onModalClose,
}: SelectStringValueModalContentProps) {
    const [value, setValue] = useState(initialValue);

    const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
    if (initialValue !== prevInitialValue) {
        setPrevInitialValue(initialValue);
        setValue(initialValue);
    }

    const onValueChange = useCallback(
        ({ value }: InputChanged<string, string>) => {
            setValue(value);
        },
        [setValue],
    );

    const onValueSelectWrapper = useCallback(() => {
        onValueSelect(value);
    }, [value, onValueSelect]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>
                {translate(modalTitleKey, { modalTitle })}
            </ModalHeader>

            <ModalBody
                className={styles.modalBody}
                scrollDirection={scrollDirections.NONE}
            >
                <Form>
                    <FormGroup>
                        <FormLabel>{translate(valueTitleKey)}</FormLabel>

                        <FormInputGroup
                            type={inputTypes.TEXT}
                            name="value"
                            value={value}
                            autoFocus={true}
                            onChange={onValueChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <Button kind={kinds.SUCCESS} onPress={onValueSelectWrapper}>
                    {translate(confirmKey)}
                </Button>
            </ModalFooter>
        </ModalContent>
    );
}
