// IMPORTS

// React
import { useCallback } from 'react';

// General Components
import Link from 'Components/Link/Link';

// CSS
import styles from './index.module.css';

// Types
export interface PageJumpBarItemProps {
    label: string;
    onItemPress: (label: string) => void;
}

// IMPLEMENTATIONS

export default function PageJumpBarItem({
    label,
    onItemPress,
}: PageJumpBarItemProps) {
    const handlePress = useCallback(() => {
        onItemPress(label);
    }, [label, onItemPress]);

    return (
        <Link className={styles.jumpBarItem} onPress={handlePress}>
            {label.toUpperCase()}
        </Link>
    );
}
