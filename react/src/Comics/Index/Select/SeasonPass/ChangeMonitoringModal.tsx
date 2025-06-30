import Modal from 'Components/Modal/Modal';
import ChangeMonitoringModalContent from './ChangeMonitoringModalContent';

interface ChangeMonitoringModalProps {
    isOpen: boolean;
    comicsIds: number[];
    onSavePress(monitor: string): void;
    onModalClose(): void;
}

function ChangeMonitoringModal(props: ChangeMonitoringModalProps) {
    const { isOpen, comicsIds, onSavePress, onModalClose } = props;

    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <ChangeMonitoringModalContent
                comicsIds={comicsIds}
                onSavePress={onSavePress}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default ChangeMonitoringModal;
