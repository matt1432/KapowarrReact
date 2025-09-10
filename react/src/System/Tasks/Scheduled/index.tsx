// IMPORTS

// Redux
import { useGetTaskPlanningQuery } from 'Store/Api/Status';

// Misc
import translate from 'Utilities/String/translate';

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
import type { TaskPlanning } from 'typings/Task';

// IMPLEMENTATIONS

const columns: Column<keyof TaskPlanning>[] = [
    {
        name: 'displayName',
        label: () => translate('Name'),
        isVisible: true,
    },
    {
        name: 'interval',
        label: () => translate('Interval'),
        isVisible: true,
    },
    {
        name: 'lastRun',
        label: () => translate('LastExecution'),
        isVisible: true,
    },
    {
        name: 'nextRun',
        label: () => translate('NextExecution'),
        isVisible: true,
    },
];

export default function TaskScheduled() {
    const { data: items = [] } = useGetTaskPlanningQuery();

    return (
        <FieldSet legend={translate('Scheduled')}>
            <Table columns={columns}>
                <TableBody>
                    {items.map((item) => (
                        <TableRow>
                            <TableRowCell className={styles.displayName}>
                                {item.displayName}
                            </TableRowCell>

                            <TableRowCell
                                className={styles.interval}
                            >{`${Math.round(item.interval / 3600)} hours`}</TableRowCell>

                            <RelativeDateCell
                                className={styles.lastRun}
                                date={item.lastRun * 1000}
                                includeTime
                            />

                            <RelativeDateCell
                                className={styles.nextRun}
                                date={item.nextRun * 1000}
                                includeTime
                            />
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </FieldSet>
    );
}
