// IMPORTS

// React
import { useCallback } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';
import {
    useClearStatusCheckMutation,
    useGetStatusChecksQuery,
} from 'Store/Api/Status';

// Misc
import { icons, socketEvents } from 'Helpers/Props';

import translate from 'Utilities/String/translate';

// Hooks
import useSocketCallback from 'Helpers/Hooks/useSocketCallback';

// General Components
import FieldSet from 'Components/FieldSet';
import IconButton from 'Components/Link/IconButton';
import PageSectionContent from 'Components/Page/PageSectionContent';
import Table from 'Components/Table/Table';
import TableBody from 'Components/Table/TableBody';
import TableRow from 'Components/Table/TableRow';
import TableRowCell from 'Components/Table/Cells/TableRowCell';

// CSS
import styles from './index.module.css';

// Utilities
import getStatusCheckMessage from './getStatusCheckMessage';

// Types
import type { StatusCheck, StatusCheckType } from 'typings/Status';

// IMPLEMENTATIONS

function StatusCheckRow({
    item,
    onClearPress,
}: {
    item: StatusCheck;
    onClearPress: (type: StatusCheckType) => void;
}) {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.statusChecks,
    );

    const handleClearPress = useCallback(() => {
        onClearPress(item.type);
    }, [item.type, onClearPress]);

    return (
        <TableRow>
            {columns.map(({ isVisible, name }) => {
                if (!isVisible) {
                    return null;
                }

                if (name === 'message') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            {getStatusCheckMessage(item)}
                        </TableRowCell>
                    );
                }

                if (name === 'actions') {
                    return (
                        <TableRowCell key={name} className={styles[name]}>
                            <IconButton
                                name={icons.CLEAR}
                                title={translate('Clear')}
                                onPress={handleClearPress}
                            />
                        </TableRowCell>
                    );
                }

                return null;
            })}
        </TableRow>
    );
}

export default function Health() {
    const { columns } = useRootSelector(
        (state) => state.tableOptions.statusChecks,
    );

    const {
        data: items = [],
        error,
        isFetching,
        isUninitialized,
        refetch,
    } = useGetStatusChecksQuery();

    const [clearStatusCheck] = useClearStatusCheckMutation();

    useSocketCallback(socketEvents.STATUS_COUNT, refetch);

    const handleClearPress = useCallback(
        (type: StatusCheckType) => {
            clearStatusCheck({ type }).finally(() => {
                refetch();
            });
        },
        [clearStatusCheck, refetch],
    );

    return (
        <FieldSet legend={translate('Health')}>
            <PageSectionContent
                errorMessage={translate('StatusChecksLoadError')}
                error={error}
                isFetching={isFetching && isUninitialized}
                isPopulated={!isUninitialized}
            >
                {items.length === 0 ? (
                    <div>{translate('NoIssuesWithYourConfiguration')}</div>
                ) : (
                    <Table tableName="statusChecks" columns={columns}>
                        <TableBody>
                            {items.map((item) => (
                                <StatusCheckRow
                                    key={item.type}
                                    item={item}
                                    onClearPress={handleClearPress}
                                />
                            ))}
                        </TableBody>
                    </Table>
                )}
            </PageSectionContent>
        </FieldSet>
    );
}
