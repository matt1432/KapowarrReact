// IMPORTS

// Redux
import { useGetTaskHistoryQuery } from 'Store/Api/Status';

// Misc
import { socketEvents } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useSocketCallback from 'Helpers/Hooks/useSocketCallback';

// General Components
import FieldSet from 'Components/FieldSet';
import RelativeDateCell from 'Components/Table/Cells/RelativeDateCell';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// CSS
import styles from './index.module.css';

// Types
import type { Column } from 'Components/Table/Column';
import type { TaskHistory } from 'typings/Task';

// IMPLEMENTATIONS

const columns: Column<keyof TaskHistory>[] = [
    {
        name: 'displayTitle',
        label: () => translate('Title'),
        isVisible: true,
    },
    {
        name: 'runAt',
        label: () => translate('Date'),
        isVisible: true,
    },
];

export default function TaskHistory() {
    const { data: items = [], refetch } = useGetTaskHistoryQuery();

    useSocketCallback(socketEvents.TASK_ENDED, refetch);

    return (
        <FieldSet legend={translate('History')}>
            <Table columns={columns}>
                <TableBody>
                    {items.map((item) => (
                        <TableRow>
                            <TableRowCell className={styles.cell}>
                                {item.displayTitle}
                            </TableRowCell>

                            <RelativeDateCell
                                className={styles.cell}
                                date={item.runAt * 1000}
                                includeTime
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </FieldSet>
    );
}
