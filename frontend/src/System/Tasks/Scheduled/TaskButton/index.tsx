// IMPORTS

// React
import { useCallback, useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

import { useExecuteCommandMutation } from 'Store/Api/Command';
import {
    useGetTaskHistoryQuery,
    useGetTaskPlanningQuery,
} from 'Store/Api/Status';

// Misc
import { commandNames, icons } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// General Components
import SpinnerIconButton from 'Components/Link/SpinnerIconButton';

// Types
import type { CommandName } from 'Helpers/Props/commandNames';

interface TaskButtonProps {
    taskName: CommandName;
}

// IMPLEMENTATIONS

export default function TaskButton({ taskName }: TaskButtonProps) {
    const { isUpdateAllRunning } = useRootSelector(
        (state) => state.socketEvents,
    );
    const isRunning = useMemo(() => {
        if (taskName === commandNames.UPDATE_ALL) {
            return isUpdateAllRunning;
        }
        return false;
    }, [isUpdateAllRunning, taskName]);

    const [executeCommand] = useExecuteCommandMutation();

    const { refetch: refetchHistory } = useGetTaskHistoryQuery(undefined, {
        selectFromResult: () => ({}),
    });
    const { refetch: refetchPlanning } = useGetTaskPlanningQuery(undefined, {
        selectFromResult: () => ({}),
    });

    const runTask = useCallback(async () => {
        await executeCommand({ cmd: taskName });
        refetchPlanning();
        refetchHistory();
    }, [executeCommand, refetchHistory, refetchPlanning, taskName]);

    return (
        <SpinnerIconButton
            name={icons.PLAY}
            title={translate('RunTask', { taskName: taskName })}
            isSpinning={isRunning}
            onPress={runTask}
        />
    );
}
