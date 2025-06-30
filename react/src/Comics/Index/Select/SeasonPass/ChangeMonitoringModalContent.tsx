import { useCallback, useState } from 'react';
import ComicsMonitoringOptionsPopoverContent from 'AddComics/ComicsMonitoringOptionsPopoverContent';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import Popover from 'Components/Tooltip/Popover';
import { icons, inputTypes, kinds, tooltipPositions } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import styles from './ChangeMonitoringModalContent.module.css';

const NO_CHANGE = 'noChange';

interface ChangeMonitoringModalContentProps {
    comicsIds: number[];
    saveError?: object;
    onSavePress(monitor: string): void;
    onModalClose(): void;
}

function ChangeMonitoringModalContent(props: ChangeMonitoringModalContentProps) {
    const { comicsIds, onSavePress, onModalClose, ...otherProps } = props;

    const [monitor, setMonitor] = useState(NO_CHANGE);

    const onInputChange = useCallback(
        ({ value }: { value: string }) => {
            setMonitor(value);
        },
        [setMonitor],
    );

    const onSavePressWrapper = useCallback(() => {
        onSavePress(monitor);
    }, [monitor, onSavePress]);

    const selectedCount = comicsIds.length;

    return (
        <ModalContent onModalClose={onModalClose}>
            <ModalHeader>{translate('MonitorIssues')}</ModalHeader>

            <ModalBody>
                <Alert kind={kinds.INFO}>
                    <div>{translate('MonitorIssuesModalInfo')}</div>
                </Alert>
                <Form {...otherProps}>
                    <FormGroup>
                        <FormLabel>
                            {translate('Monitoring')}

                            <Popover
                                anchor={<Icon className={styles.labelIcon} name={icons.INFO} />}
                                title={translate('MonitoringOptions')}
                                body={<ComicsMonitoringOptionsPopoverContent />}
                                position={tooltipPositions.RIGHT}
                            />
                        </FormLabel>

                        <FormInputGroup
                            type={inputTypes.MONITOR_ISSUES_SELECT}
                            name="monitor"
                            value={monitor}
                            includeNoChange={true}
                            onChange={onInputChange}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>

            <ModalFooter className={styles.modalFooter}>
                <div className={styles.selected}>
                    {translate('CountComicsSelected', { count: selectedCount })}
                </div>

                <div>
                    <Button onPress={onModalClose}>{translate('Cancel')}</Button>

                    <Button onPress={onSavePressWrapper}>{translate('Save')}</Button>
                </div>
            </ModalFooter>
        </ModalContent>
    );
}

export default ChangeMonitoringModalContent;
