// IMPORTS

// React
import { useCallback, useState } from 'react';

// General Components
import Link from 'Components/Link/Link';

// Specific Components
import IssueDetailsModal from 'Issue/IssueDetailsModal';

// CSS
import styles from './IssueTitleLink.module.css';

// Types
interface IssueTitleLinkProps {
    issueId: number;
    volumeId: number;
    issueTitle: string;
    showOpenVolumeButton: boolean;
}

// IMPLEMENTATIONS

function IssueTitleLink(props: IssueTitleLinkProps) {
    const { issueTitle, ...otherProps } = props;
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const handleLinkPress = useCallback(() => {
        setIsDetailsModalOpen(true);
    }, [setIsDetailsModalOpen]);
    const handleModalClose = useCallback(() => {
        setIsDetailsModalOpen(false);
    }, [setIsDetailsModalOpen]);

    return (
        <div className={styles.container}>
            <Link className={styles.link} onPress={handleLinkPress}>
                {issueTitle}
            </Link>

            <IssueDetailsModal
                isOpen={isDetailsModalOpen}
                issueTitle={issueTitle}
                {...otherProps}
                onModalClose={handleModalClose}
            />
        </div>
    );
}

export default IssueTitleLink;
