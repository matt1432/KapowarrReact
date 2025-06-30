import Modal from 'Components/Modal/Modal';
import ChangeMonitoringModalContent from './ChangeMonitoringModalContent';

interface ChangeMonitoringModalProps {
    isOpen: boolean;
    volumesIds: number[];
    onSavePress(monitor: string): void;
    onModalClose(): void;
}

function ChangeMonitoringModal(props: ChangeMonitoringModalProps) {
    const { isOpen, volumesIds, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ChangeMonitoringModalContent
                volumesIds={volumesIds}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default ChangeMonitoringModal;
