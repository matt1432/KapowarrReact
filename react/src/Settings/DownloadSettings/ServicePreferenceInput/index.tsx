// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { DndProvider } from 'react-dnd-multi-backend';

// General Components
import FormInputHelpText from 'Components/Form/FormInputHelpText';

// Specific Components
import ServiceRow from './ServiceRow';

// CSS
import styles from './index.module.css';

// Types
import type { GCDownloadSource } from 'Helpers/Props/GCDownloadSources';
import type { InputChanged } from 'typings/Inputs';

export interface ServicePreferenceInputProps {
    value: GCDownloadSource[];
    onChange: (change: InputChanged<'servicePreference', GCDownloadSource[]>) => void;
    helpText?: string;
}

// IMPLEMENTATIONS

export default function ServicePreferenceInput({
    value,
    onChange,
    helpText,
}: ServicePreferenceInputProps) {
    // DnD
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    const isDragging = useMemo(() => dropIndex !== null, [dropIndex]);
    const isDraggingUp = useMemo(
        () => isDragging && dropIndex !== null && dragIndex !== null && dropIndex < dragIndex,
        [dragIndex, dropIndex, isDragging],
    );
    const isDraggingDown = useMemo(
        () => isDragging && dropIndex !== null && dragIndex !== null && dropIndex > dragIndex,
        [dragIndex, dropIndex, isDragging],
    );

    const handleServicePreferenceDragMove = useCallback(
        (newDragIndex: number, newDropIndex: number) => {
            setDropIndex(newDropIndex);
            setDragIndex(newDragIndex);
        },
        [],
    );

    const handleServicePreferenceDragEnd = useCallback(
        (didDrop: boolean) => {
            if (didDrop && dragIndex && dropIndex !== null) {
                const newServices = [...value];
                const items = newServices.splice(dragIndex, 1);
                newServices.splice(dropIndex, 0, items[0]);

                onChange({ name: 'servicePreference', value: newServices });
            }

            setDragIndex(null);
            setDropIndex(null);
        },
        [dragIndex, dropIndex, onChange, value],
    );

    return (
        <DndProvider options={HTML5toTouch}>
            <div>
                {helpText ? <FormInputHelpText text={helpText} /> : null}

                <div className={styles.columns}>
                    {value.map((service, index) => (
                        <ServiceRow
                            key={service}
                            name={service}
                            index={index}
                            isDraggingUp={isDraggingUp}
                            isDraggingDown={isDraggingDown}
                            onServiceRowDragMove={handleServicePreferenceDragMove}
                            onServiceRowDragEnd={handleServicePreferenceDragEnd}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
}
