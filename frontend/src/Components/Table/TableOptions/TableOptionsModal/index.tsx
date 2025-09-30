// IMPORTS

// React
import React, { useCallback, useState } from 'react';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { DndProvider } from 'react-dnd-multi-backend';

// Misc
import translate from 'Utilities/String/translate';

// General Components
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputHelpText from 'Components/Form/FormInputHelpText';
import FormLabel from 'Components/Form/FormLabel';
import Button from 'Components/Link/Button';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';

// Specific Components
import TableOptionsColumn from '../TableOptionsColumn';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/Inputs';
import type { Column } from '../../Column';
import type {
    ColumnNameMap,
    SetTableOptionsParams,
} from 'Store/Slices/TableOptions';

export interface TableOptionsModalProps<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
> {
    tableName: K;
    isOpen: boolean;
    columns: Column<T>[];
    canModifyColumns?: boolean;
    optionsComponent?: React.ElementType;
    onTableOptionChange: (payload: SetTableOptionsParams<K>) => void;
    onModalClose: () => void;
}

// IMPLEMENTATIONS

export default function TableOptionsModal<
    T extends ColumnNameMap[K],
    K extends keyof ColumnNameMap,
>({
    tableName,
    isOpen,
    columns,
    canModifyColumns = true,
    optionsComponent: OptionsComponent,
    onTableOptionChange,
    onModalClose,
}: TableOptionsModalProps<T, K>) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    const isDragging = dropIndex !== null;
    const isDraggingUp =
        isDragging &&
        dropIndex !== null &&
        dragIndex !== null &&
        dropIndex < dragIndex;
    const isDraggingDown =
        isDragging &&
        dropIndex !== null &&
        dragIndex !== null &&
        dropIndex > dragIndex;

    const handleVisibleChange = useCallback(
        ({ name, value }: CheckInputChanged<T>) => {
            const newColumns = columns.map((column) => {
                if (column.name === name) {
                    return {
                        ...column,
                        isVisible: value,
                    };
                }

                return column;
            });

            onTableOptionChange({
                tableName,
                columns: newColumns,
            } as unknown as SetTableOptionsParams<K>);
        },
        [columns, onTableOptionChange, tableName],
    );

    const handleColumnDragMove = useCallback(
        (newDragIndex: number, newDropIndex: number) => {
            setDropIndex(newDropIndex);
            setDragIndex(newDragIndex);
        },
        [],
    );

    const handleColumnDragEnd = useCallback(
        (didDrop: boolean) => {
            if (
                didDrop &&
                typeof dragIndex === 'number' &&
                typeof dropIndex === 'number' &&
                dragIndex !== dropIndex
            ) {
                const newColumns = [...columns];
                const items = newColumns.splice(dragIndex, 1);
                newColumns.splice(dropIndex, 0, items[0]);

                onTableOptionChange({
                    tableName,
                    columns: newColumns,
                } as unknown as SetTableOptionsParams<K>);
            }

            setDragIndex(null);
            setDropIndex(null);
        },
        [dragIndex, dropIndex, columns, onTableOptionChange, tableName],
    );

    return (
        <DndProvider options={HTML5toTouch}>
            <Modal isOpen={isOpen} onModalClose={onModalClose}>
                {isOpen ? (
                    <ModalContent onModalClose={onModalClose}>
                        <ModalHeader>{translate('TableOptions')}</ModalHeader>

                        <ModalBody>
                            <Form>
                                {OptionsComponent ? (
                                    <OptionsComponent
                                        onTableOptionChange={
                                            onTableOptionChange
                                        }
                                    />
                                ) : null}

                                {canModifyColumns ? (
                                    <FormGroup>
                                        <FormLabel>
                                            {translate('TableColumns')}
                                        </FormLabel>

                                        <div>
                                            <FormInputHelpText
                                                text={translate(
                                                    'TableColumnsHelpText',
                                                )}
                                            />

                                            <div className={styles.columns}>
                                                {columns.map(
                                                    (column, index) => {
                                                        const {
                                                            name,
                                                            isVisible,
                                                            isModifiable = true,
                                                        } = column;

                                                        return (
                                                            <TableOptionsColumn
                                                                key={name}
                                                                name={name}
                                                                isVisible={
                                                                    isVisible
                                                                }
                                                                isModifiable={
                                                                    isModifiable
                                                                }
                                                                index={index}
                                                                isDraggingUp={
                                                                    isDraggingUp
                                                                }
                                                                isDraggingDown={
                                                                    isDraggingDown
                                                                }
                                                                onVisibleChange={
                                                                    handleVisibleChange
                                                                }
                                                                onColumnDragMove={
                                                                    handleColumnDragMove
                                                                }
                                                                onColumnDragEnd={
                                                                    handleColumnDragEnd
                                                                }
                                                            />
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </FormGroup>
                                ) : null}
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={onModalClose}>
                                {translate('Close')}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                ) : null}
            </Modal>
        </DndProvider>
    );
}
