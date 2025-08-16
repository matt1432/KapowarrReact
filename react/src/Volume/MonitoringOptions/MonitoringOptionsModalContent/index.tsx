// IMPORTS

// React
import { useCallback, useEffect, useState } from 'react';

// Redux
import { useUpdateVolumeMutation } from 'Store/Api/Volumes';

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
import styles from './index.module.css';

// Types
import type { InputChanged } from 'typings/inputs';
import type { MonitoringScheme } from 'Volume/Volume';

export interface MonitoringOptionsModalContentProps {
    volumeId: number;
    onModalClose: () => void;
    refetch: () => void;
}

// IMPLEMENTATIONS

const NO_CHANGE = 'noChange';

function MonitoringOptionsModalContent({
    volumeId,
    onModalClose,
    refetch,
}: MonitoringOptionsModalContentProps) {
    const [updateVolumeMonitoringScheme, updateVolumeMonitoringSchemeState] =
        useUpdateVolumeMutation();

    useEffect(() => {
        if (updateVolumeMonitoringSchemeState.isSuccess) {
            refetch();
        }
    }, [refetch, updateVolumeMonitoringSchemeState]);

    const { isLoading: isSaving, error: saveError } = updateVolumeMonitoringSchemeState;

    const [monitoringScheme, setMonitoringScheme] = useState<MonitoringScheme | typeof NO_CHANGE>(
        NO_CHANGE,
    );
    const wasSaving = usePrevious(isSaving);

    const handleMonitorChange = useCallback(({ value }: InputChanged<string>) => {
        setMonitoringScheme(value as MonitoringScheme);
    }, []);

    const handleSavePress = useCallback(() => {
        if (monitoringScheme === NO_CHANGE) {
            onModalClose();
            return;
        }

        updateVolumeMonitoringScheme({
            volumeId,
            monitoringScheme,
        });
    }, [monitoringScheme, onModalClose, volumeId, updateVolumeMonitoringScheme]);

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
                            value={monitoringScheme}
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
