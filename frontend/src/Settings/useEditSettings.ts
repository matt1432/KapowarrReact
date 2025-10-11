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
    const { settings, isSuccess, refetch } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data, isSuccess }) => ({
            settings: data,
            isSuccess,
        }),
    });

    const [saveSettings] = useSaveSettingsMutation();

    const [isSaving, setIsSaving] = useState(false);
    const [changes, setChanges] = useState<SettingsValue>(settings!);

    const [wasSuccess, setWasSuccess] = useState(false);

    if (isSuccess !== wasSuccess) {
        setWasSuccess(isSuccess);

        if (isSuccess) {
            setIsSaving(false);
            setChanges(settings!);
        }
    }

    const onSavePress = useCallback(() => {
        setIsSaving(true);
        saveSettings(
            filterObject(
                changes,
                ([key, value]) =>
                    key !== 'apiKey' &&
                    value !== settings?.[key as keyof typeof changes],
            ),
        ).finally(() => {
            refetch();
        });
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
