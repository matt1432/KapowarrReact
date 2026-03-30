// IMPORTS

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import SelectIssueModalContent from './SelectIssueModalContent';

// Types
import type { SelectedIssue } from './SelectIssueModalContent';

interface SelectIssueModalProps {
    isOpen: boolean;
    selectedIds: number[] | string[];
    volumeId: number;
    modalTitle: string;
    onIssuesSelect(selectedIssues: SelectedIssue[]): void;
    onModalClose(): void;
}

export default function SelectIssueModal({
    isOpen,
    selectedIds,
    volumeId,
    modalTitle,
    onIssuesSelect,
    onModalClose,
}: SelectIssueModalProps) {
    return (
        <Modal isOpen={isOpen} onModalClose={onModalClose}>
            <SelectIssueModalContent
                selectedIds={selectedIds}
                volumeId={volumeId}
                modalTitle={modalTitle}
                onIssuesSelect={onIssuesSelect}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}
