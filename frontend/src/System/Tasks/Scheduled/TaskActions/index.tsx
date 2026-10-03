// IMPORTS

// React
import { useCallback, useState } from 'react';

// Misc
import { icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import IconButton from 'Components/Link/IconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Specific Components
import EditScheduleModal from '../EditScheduleModal';
import TaskButton from '../TaskButton';

// Types
import type { CommandName } from 'Helpers/Props/commandNames';

interface TaskActionsProps {
    taskName: CommandName;
    schedule: string;
    onScheduleChange: () => void;
}

// IMPLEMENTATIONS

export default function TaskActions({
    taskName,
    schedule,
    onScheduleChange,
}: TaskActionsProps) {
    const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] =
        useState(false);

    const handleEditSchedulePress = useCallback(() => {
        setIsEditScheduleModalOpen(true);
    }, []);

    const handleEditScheduleModalClose = useCallback(() => {
        setIsEditScheduleModalOpen(false);
    }, []);

    return (
        <TableRowCell>
            <TaskButton taskName={taskName} />

            <IconButton
                name={icons.EDIT}
                title={translate('EditTaskSchedule')}
                onPress={handleEditSchedulePress}
            />

            <EditScheduleModal
                isOpen={isEditScheduleModalOpen}
                taskName={taskName}
                schedule={schedule}
                onModalClose={handleEditScheduleModalClose}
                onScheduleChange={onScheduleChange}
            />
        </TableRowCell>
    );
}
