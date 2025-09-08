// IMPORTS

// React
import { useCallback, useEffect, useMemo, useState } from 'react';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import { DndProvider } from 'react-dnd-multi-backend';

// Misc
import translate, { type TranslateKey } from 'Utilities/String/translate';

// General Components
import FormInputHelpText from 'Components/Form/FormInputHelpText';

// Specific Components
import FormatPreference from './FormatPreference';

// CSS
import styles from './index.module.css';

// Types
import type { CheckInputChanged } from 'typings/Inputs';
import { useGetAvailableFormatsQuery } from 'Store/Api/Settings';

interface Format {
    name: TranslateKey;
    isVisible: boolean;
}

export interface FormatPreferenceInputProps {
    value: TranslateKey[];
    onChange: (value: string[]) => void;
    helpText?: string;
}

// IMPLEMENTATIONS

export default function FormatPreferenceInput({
    value,
    onChange,
    helpText,
}: FormatPreferenceInputProps) {
    const { data: availableFormats = [] } = useGetAvailableFormatsQuery();

    const [formats, setFormats] = useState<Format[]>(
        value.map((format) => ({
            name: format,
            isVisible: true,
        })),
    );

    useEffect(() => {
        if (availableFormats.length !== formats.length) {
            setFormats([
                ...formats,
                ...availableFormats
                    .filter((f) => !formats.find((format) => format.name === f))
                    .map((format) => ({
                        name: format,
                        isVisible: false,
                    })),
            ]);
        }
    }, [availableFormats, formats]);

    const handleVisibleChange = useCallback(
        ({ name, value }: CheckInputChanged<string>) => {
            const newFormats = formats.map((format) => {
                if (format.name === name) {
                    return {
                        ...format,
                        isVisible: value,
                    };
                }

                return format;
            });

            setFormats(newFormats);
            onChange(newFormats.filter((f) => f.isVisible).map((f) => f.name));
        },
        [formats, onChange],
    );

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

    const handleFormatPreferenceDragMove = useCallback(
        (newDragIndex: number, newDropIndex: number) => {
            setDropIndex(newDropIndex);
            setDragIndex(newDragIndex);
        },
        [],
    );

    const handleFormatPreferenceDragEnd = useCallback(
        (didDrop: boolean) => {
            if (didDrop && dragIndex && dropIndex !== null) {
                const newFormats = [...formats];
                const items = newFormats.splice(dragIndex, 1);
                newFormats.splice(dropIndex, 0, items[0]);

                setFormats(newFormats);
                onChange(newFormats.filter((f) => f.isVisible).map((f) => f.name));
            }

            setDragIndex(null);
            setDropIndex(null);
        },
        [dragIndex, dropIndex, formats, onChange],
    );

    return (
        <DndProvider options={HTML5toTouch}>
            <div>
                {helpText ? <FormInputHelpText text={helpText} /> : null}

                <div className={styles.columns}>
                    {formats.map((format, index) => (
                        <FormatPreference
                            key={format.name}
                            name={format.name}
                            label={translate(format.name)}
                            isVisible={format.isVisible}
                            index={index}
                            isDraggingUp={isDraggingUp}
                            isDraggingDown={isDraggingDown}
                            onVisibleChange={handleVisibleChange}
                            onFormatPreferenceDragMove={handleFormatPreferenceDragMove}
                            onFormatPreferenceDragEnd={handleFormatPreferenceDragEnd}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
}
