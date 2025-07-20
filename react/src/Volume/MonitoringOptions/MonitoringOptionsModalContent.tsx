// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useUpdateVolumeMutation, type UpdateVolumeParams } from 'Store/createApiEndpoints';

// Misc
import { icons, kinds, tooltipPositions } from 'Helpers/Props';

import usePrevious from 'Helpers/Hooks/usePrevious';
import translate from 'Utilities/String/translate';

// General Components
import VolumeMonitoringOptionsPopoverContent from 'AddVolume/VolumeMonitoringOptionsPopoverContent';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import SpinnerButton from 'Components/Link/SpinnerButton';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';

// CSS
import styles from './MonitoringOptionsModalContent.module.css';

// Types
import type { InputChanged } from 'typings/inputs';

export interface MonitoringOptionsModalContentProps {
    volumeId: number;
    onModalClose: () => void;
}

type Monitor = NonNullable<UpdateVolumeParams['monitoring_scheme']>;

// IMPLEMENTATIONS

const NO_CHANGE = 'noChange';

function MonitoringOptionsModalContent({
    volumeId,
    onModalClose,
}: MonitoringOptionsModalContentProps) {
    const [updateVolumeMonitor, updateVolumeMonitorState] = useUpdateVolumeMutation();

    const { isLoading: isSaving, error: saveError } = updateVolumeMonitorState;

    const [monitor, setMonitor] = useState<Monitor | typeof NO_CHANGE>(NO_CHANGE);
    const wasSaving = usePrevious(isSaving);

    const handleMonitorChange = useCallback(({ value }: InputChanged<string>) => {
        setMonitor(value as Monitor);
    }, []);

    const handleSavePress = useCallback(() => {
        if (monitor === NO_CHANGE) {
            return;
        }

        updateVolumeMonitor({
            volumeId,
            monitoring_scheme: monitor,
        });
    }, [monitor, volumeId, updateVolumeMonitor]);

    useEffect(() => {
        if (!isSaving && wasSaving && !saveError) {
            onModalClose();
        }
    }, [isSaving, wasSaving, saveError, onModalClose]);

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('MonitorIssues')}</ModalHeader>

            <ModalBody>
                <Alert kind={kinds.INFO}>
                    <div>{translate('MonitorIssuesModalInfo')}</div>
                </Alert>
                <Form>
                    <FormGroup>
                        <FormLabel>
                            {translate('Monitoring')}

                            <Popover
                                anchor={<Icon className={styles.labelIcon} name={icons.INFO} />}
                                title={translate('MonitoringOptions')}
                                body={<VolumeMonitoringOptionsPopoverContent />}
                                position={tooltipPositions.RIGHT}
                            />
                        </FormLabel>

                        <FormInputGroup
                            type="monitorIssuesSelect"
                            name="monitor"
                            value={monitor}
                            includeNoChange={true}
                            onChange={handleMonitorChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter>
                <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                <SpinnerButton isSpinning={isSaving} onPress={handleSavePress}>
                    {translate('Save')}
                </SpinnerButton>
            </ModalFooter>
        </ModalContent>
    );
}

export default MonitoringOptionsModalContent;
