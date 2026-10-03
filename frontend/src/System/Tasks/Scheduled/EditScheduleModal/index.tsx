// IMPORTS

// React
import { useCallback, useState } from 'react';

// Redux
import { useUpdateTaskScheduleMutation } from 'Store/Api/Status';

// Misc
import { inputTypes, kinds } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import Alert from 'Components/Alert';
import Button from 'Components/Link/Button';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import SpinnerButton from 'Components/Link/SpinnerButton';

// Specific Components
import schedulePresets from '../schedulePresets';

// Types
import type { CommandName } from 'Helpers/Props/commandNames';
import type { InputChanged } from 'typings/Inputs';

interface EditScheduleModalProps {
    isOpen: boolean;
    taskName: CommandName;
    schedule: string;
    onModalClose: () => void;
    onScheduleChange: () => void;
}

// IMPLEMENTATIONS

const customPreset = '';

function getPreset(schedule: string) {
    return schedulePresets.some(({ key }) => key === schedule)
        ? schedule
        : customPreset;
}

export default function EditScheduleModal({
    isOpen,
    taskName,
    schedule: initialSchedule,
    onModalClose,
    onScheduleChange,
}: EditScheduleModalProps) {
    const [updateTaskSchedule, { isLoading, isError }] =
        useUpdateTaskScheduleMutation();

    const [preset, setPreset] = useState(getPreset(initialSchedule));
    const [schedule, setSchedule] = useState(initialSchedule);

    const [prevSchedule, setPrevSchedule] = useState(initialSchedule);
    const [wasOpen, setWasOpen] = useState(isOpen);
    if (initialSchedule !== prevSchedule || isOpen !== wasOpen) {
        setPrevSchedule(initialSchedule);
        setWasOpen(isOpen);
        setPreset(getPreset(initialSchedule));
        setSchedule(initialSchedule);
    }

    const handlePresetChange = useCallback(
        ({ value }: InputChanged<'preset', string>) => {
            setPreset(value);
            setSchedule(value);
        },
        [],
    );

    const handleScheduleChange = useCallback(
        ({ value }: InputChanged<'schedule', string>) => {
            setSchedule(value);
        },
        [],
    );

    const handleSavePress = useCallback(async () => {
        const { error } = await updateTaskSchedule({
            taskName,
            schedule: schedule.trim(),
        });
        if (error) {
            return;
        }

        onScheduleChange();
        onModalClose();
    }, [
        onModalClose,
        onScheduleChange,
        schedule,
        taskName,
        updateTaskSchedule,
    ]);

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ModalContent onModalClose={onModalClose}>
                <ModalHeader>{translate('EditTaskSchedule')}</ModalHeader>

                <ModalBody>
                    {isError ? (
                        <Alert kind={kinds.DANGER}>
                            {translate('CustomScheduleInvalid')}
                        </Alert>
                    ) : null}

                    <Form>
                        <FormGroup>
                            <FormLabel>{translate('TaskSchedule')}</FormLabel>

                            <FormInputGroup
                                type={inputTypes.SELECT}
                                name="preset"
                                onChange={handlePresetChange}
                                value={preset}
                                values={[
                                    ...schedulePresets,
                                    {
                                        key: customPreset,
                                        value: translate('CustomSchedule'),
                                    },
                                ]}
                            />
                        </FormGroup>

                        {preset === customPreset ? (
                            <FormGroup>
                                <FormLabel>
                                    {translate('CustomSchedule')}
                                </FormLabel>

                                <FormInputGroup
                                    type={inputTypes.TEXT}
                                    name="schedule"
                                    helpText={translate(
                                        'CustomScheduleHelpText',
                                    )}
                                    placeholder="E.g. '0 * * * *'"
                                    onChange={handleScheduleChange}
                                    value={schedule}
                                />
                            </FormGroup>
                        ) : null}
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <Button onPress={onModalClose}>
                        {translate('Cancel')}
                    </Button>

                    <SpinnerButton
                        isSpinning={isLoading}
                        onPress={handleSavePress}
                    >
                        {translate('Save')}
                    </SpinnerButton>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
