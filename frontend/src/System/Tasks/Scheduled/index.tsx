// IMPORTS

// Redux
import { useRootSelector } from 'Store/createAppStore';
import { useGetTaskPlanningQuery } from 'Store/Api/Status';

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

// Specific Components
import schedulePresets from './schedulePresets';
import TaskActions from './TaskActions';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function TaskScheduled() {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.taskPlanning,
    );

    const { data: items = [], refetch } = useGetTaskPlanningQuery();

    useSocketCallback(socketEvents.TASK_ENDED, refetch);

    return (
        <FieldSet legend={translate('Scheduled')}>
            <Table tableName="taskPlanning" columns={columns}>
                <TableBody>
                    {items.map((item) => (
                        <TableRow>
                            {columns.map(({ isVisible, name }) => {
                                if (!isVisible) {
                                    return null;
                                }

                                if (name === 'displayName') {
                                    return (
                                        <TableRowCell
                                            key={name}
                                            className={styles[name]}
                                        >
                                            {item.displayName}
                                        </TableRowCell>
                                    );
                                }

                                if (name === 'schedule') {
                                    return (
                                        <TableRowCell
                                            key={name}
                                            className={styles[name]}
                                        >
                                            {schedulePresets.find(
                                                ({ key }) =>
                                                    key === item.schedule,
                                            )?.value ?? item.schedule}
                                        </TableRowCell>
                                    );
                                }

                                if (name === 'lastRun') {
                                    return (
                                        <RelativeDateCell
                                            key={name}
                                            className={styles[name]}
                                            date={item.lastRun * 1000}
                                            includeTime
                                        />
                                    );
                                }

                                if (name === 'nextRun') {
                                    return (
                                        <RelativeDateCell
                                            key={name}
                                            className={styles[name]}
                                            date={item.nextRun * 1000}
                                            includeTime
                                        />
                                    );
                                }

                                if (name === 'actions') {
                                    return (
                                        <TaskActions
                                            key={name}
                                            taskName={item.taskName}
                                            schedule={item.schedule}
                                            onScheduleChange={refetch}
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
