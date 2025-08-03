// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { sizes } from 'Helpers/Props';

// General Components
import Modal from 'Components/Modal/Modal';

// Specific Components
import IssueDetailsModalContent from './IssueDetailsModalContent';

// Types
import type { IssueDetailsTab } from 'Issue/IssueDetailsTab';

// IMPLEMENTATIONS

interface IssueDetailsModalProps {
    isOpen: boolean;
    issueId: number;
    volumeId: number;
    issueTitle: string;
    isSaving?: boolean;
    showOpenVolumeButton?: boolean;
    selectedTab?: IssueDetailsTab;
    startInteractiveSearch?: boolean;
    onModalClose(): void;
}

function IssueDetailsModal({
    selectedTab,
    isOpen,
    onModalClose,
    ...otherProps
}: IssueDetailsModalProps) {
    const [closeOnBackgroundClick, setCloseOnBackgroundClick] = useState(selectedTab !== 'search');

    const handleTabChange = useCallback(
        (isSearch: boolean) => {
            setCloseOnBackgroundClick(!isSearch);
        },
        [setCloseOnBackgroundClick],
    );

    return (
        <Modal
            isOpen={isOpen}
            size={sizes.EXTRA_EXTRA_LARGE}
            closeOnBackgroundClick={closeOnBackgroundClick}
            onModalClose={onModalClose}
        >
            <IssueDetailsModalContent
                {...otherProps}
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
                onModalClose={onModalClose}
            />
        </Modal>
    );
}

export default IssueDetailsModal;
