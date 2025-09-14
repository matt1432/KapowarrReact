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

interface ChangeMatchRowProps {
    match: VolumeSearchResult;
    columns: Column<keyof VolumeSearchResult>[];
    onEditMatch: (match: VolumeMetadata) => void;
}

// IMPLEMENTATIONS

export default function ChangeMatchRow({ match, columns, onEditMatch }: ChangeMatchRowProps) {
    const handleOnEditMatch = useCallback(() => {
        onEditMatch(match);
    }, [onEditMatch, match]);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'title') {
                    return (
                        <TableRowCell>
                            <Link to={match.siteUrl}>{match.title}</Link>
                        </TableRowCell>
                    );
                }
                if (name === 'issueCount') {
                    return <TableRowCell>{match.issueCount}</TableRowCell>;
                }
                if (name === 'actions') {
                    return (
                        <TableRowCell className={styles.actions}>
                            <IconButton
                                title={translate('Select')}
                                name={icons.ADD}
                                onPress={handleOnEditMatch}
                            />

                            <IconButton
                                title={translate('SelectGroup')}
                                name={icons.CLONE}
                                // TODO:
                                onPress={handleOnEditMatch}
                            />
                        </TableRowCell>
                    );
                }
            })}
        </TableRow>
    );
}
