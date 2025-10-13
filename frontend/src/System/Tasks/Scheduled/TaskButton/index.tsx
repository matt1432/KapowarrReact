// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useExecuteCommandMutation } from 'Store/Api/Command';

// Misc
import { commandNames, icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// Types
import type { CommandName } from 'Helpers/Props/commandNames';

interface TaskButtonProps {
    taskName: CommandName;
}

// IMPLEMENTATIONS

export default function TaskButton({ taskName }: TaskButtonProps) {
    const { isUpdateAllRunning, isSearchAllRunning } = useRootSelector(
        (state) => state.socketEvents,
    );
    const isRunning = useMemo(
        () =>
            taskName === commandNames.SEARCH_ALL
                ? isSearchAllRunning
                : isUpdateAllRunning,
        [isSearchAllRunning, isUpdateAllRunning, taskName],
    );

    const [executeCommand] = useExecuteCommandMutation();

    const runTask = useCallback(() => {
        executeCommand({ cmd: taskName });
    }, [executeCommand, taskName]);

    return (
        <TableRowCell key={taskName}>
            <SpinnerIconButton
                name={icons.PLAY}
                title={translate('RunTask', { taskName: taskName })}
                isSpinning={isRunning}
                onPress={runTask}
            />
        </TableRowCell>
    );
}
