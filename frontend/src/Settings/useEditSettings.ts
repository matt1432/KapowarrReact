// IMPORTS

// React
import { useCallback, useMemo, useState } from 'react';

// Redux
import {
    useGetSettingsQuery,
    useSaveSettingsMutation,
} from 'Store/Api/Settings';

// Misc
import filterObject from 'Utilities/Object/filterObject';

// Types
import type { InputChanged } from 'typings/Inputs';
import type { SettingsValue } from 'typings/Settings';

// IMPLEMENTATIONS

export default function useEditSettings() {
    const { settings, refetch } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data, isSuccess }) => ({
            settings: data,
            isSuccess,
        }),
    });

    const [saveSettings] = useSaveSettingsMutation();

    const [changes, setChanges] = useState<SettingsValue>(settings!);

    const [isSaving, setIsSaving] = useState(false);
    const [prevSettings, setPrevSettings] = useState(settings);
    if (settings !== prevSettings) {
        setPrevSettings(settings);
        setChanges(settings!);
    }

    const onSavePress = useCallback(async () => {
        setIsSaving(true);

        await saveSettings(
            filterObject(
                changes,
                ([key, value]) =>
                    key !== 'apiKey' &&
                    value !== settings?.[key as keyof typeof changes],
            ),
        );

        await refetch();

        setIsSaving(false);
    }, [changes, refetch, saveSettings, settings]);

    const handleInputChange = useCallback(
        <Key extends keyof SettingsValue>({
            name,
            value,
        }: InputChanged<Key, SettingsValue[Key]>) => {
            setChanges({
                ...changes,
                [name]: value,
            });
        },
        [changes],
    );

    const handleNonNullInputChange = useCallback(
        <Key extends keyof SettingsValue>({
            name,
            value,
        }: InputChanged<Key, SettingsValue[Key] | null>) => {
            if (value !== null) {
                handleInputChange({ name, value });
            }
        },
        [handleInputChange],
    );

    const hasPendingChanges = useMemo(() => {
        return JSON.stringify(changes) !== JSON.stringify(settings);
    }, [changes, settings]);

    return {
        isSaving,
        onSavePress,
        handleInputChange,
        handleNonNullInputChange,
        hasPendingChanges,
        changes,
    };
}
