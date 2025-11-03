// IMPORTS

// React
import { useCallback } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import Link from 'Components/Link/Link';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { VolumeSearchResult } from '../ChangeMatchModalContent';
import type { VolumeMetadata } from 'AddVolume/AddVolume';
import type { ChangeMatchColumnName } from '../columns';

interface ChangeMatchRowProps {
    match: VolumeSearchResult;
    columns: Column<ChangeMatchColumnName>[];
    onEditMatch: (match: VolumeMetadata) => void;
    onEditGroupMatch: (match: VolumeMetadata) => void;
}

// IMPLEMENTATIONS

export default function ChangeMatchRow({
    match,
    columns,
    onEditMatch,
    onEditGroupMatch,
}: ChangeMatchRowProps) {
    const handleOnEditMatch = useCallback(() => {
        onEditMatch(match);
    }, [onEditMatch, match]);

    const handleOnEditGroupMatch = useCallback(() => {
        onEditGroupMatch(match);
    }, [onEditGroupMatch, match]);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'title') {
                    return (
                        <TableRowCell key={name}>
                            <Link to={match.siteUrl}>{match.title}</Link>
                        </TableRowCell>
                    );
                }
                if (name === 'issueCount') {
                    return (
                        <TableRowCell key={name}>
                            {match.issueCount}
                        </TableRowCell>
                    );
                }
                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles.actions}>
                            <IconButton
                                title={translate('Select')}
                                name={icons.ADD}
                                onPress={handleOnEditMatch}
                            />

                            <IconButton
                                title={translate('SelectGroup')}
                                name={icons.CLONE}
                                onPress={handleOnEditGroupMatch}
                            />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
