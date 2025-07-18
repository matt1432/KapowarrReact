// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { icons } from 'Helpers/Props';

// General Components
import Icon from 'Components/Icon';
import TableRowCell from 'Components/Table/Cells/TableRowCell';
import TableRowButton from 'Components/Table/TableRowButton';

// CSS
import styles from './FileBrowserRow.module.css';

// Types
// import type { PathType } from 'App/State/PathsAppState';

interface FileBrowserRowProps {
    type: string;
    name: string;
    path: string;
    onPress: (path: string) => void;
}

// IMPLEMENTATIONS

function getIconName(type: string) {
    switch (type) {
        case 'computer':
            return icons.COMPUTER;
        case 'drive':
            return icons.DRIVE;
        case 'file':
            return icons.FILE;
        case 'parent':
            return icons.PARENT;
        default:
            return icons.FOLDER;
    }
}

function FileBrowserRow(props: FileBrowserRowProps) {
    const { type, name, path, onPress } = props;

    const handlePress = useCallback(() => {
        onPress(path);
    }, [path, onPress]);

    return (
        <TableRowButton onPress={handlePress}>
            <TableRowCell className={styles.type}>
                <Icon name={getIconName(type)} />
            </TableRowCell>

            <TableRowCell>{name}</TableRowCell>
        </TableRowButton>
    );
}

export default FileBrowserRow;
