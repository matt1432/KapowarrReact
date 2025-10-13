// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';
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
import type { TaskHistory } from 'typings/Task';

// IMPLEMENTATIONS

export default function TaskHistory() {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.taskHistory,
    );

    const { data: items = [], refetch } = useGetTaskHistoryQuery();

    useSocketCallback(socketEvents.TASK_ENDED, refetch);

    return (
        <FieldSet legend={translate('History')}>
            <Table tableName="taskHistory" columns={columns}>
                <TableBody>
                    {items.map((item) => (
                        <TableRow>
                            {columns.map(({ name, isVisible }) => {
                                if (!isVisible) {
                                    return null;
                                }

                                if (name === 'displayTitle') {
                                    return (
                                        <TableRowCell
                                            key={name}
                                            className={styles.cell}
                                        >
                                            {item.displayTitle}
                                        </TableRowCell>
                                    );
                                }
                                if (name === 'runAt') {
                                    return (
                                        <RelativeDateCell
                                            key={name}
                                            className={styles.cell}
                                            date={item.runAt * 1000}
                                            includeTime
                                        />
                                    );
                                }
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </FieldSet>
    );
}
