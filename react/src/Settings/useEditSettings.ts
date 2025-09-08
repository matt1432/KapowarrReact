import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetSettingsQuery, useSaveSettingsMutation } from 'Store/Api/Settings';
import type { InputChanged } from 'typings/Inputs';
import type { SettingsValue } from 'typings/Settings';

export default function useEditSettings() {
    const { settings, isSuccess } = useGetSettingsQuery(undefined, {
        selectFromResult: ({ data, isSuccess }) => ({
            settings: data,
            isSuccess,
        }),
    });

    const [saveSettings] = useSaveSettingsMutation();

    const [isSaving, setIsSaving] = useState(false);
    const [changes, setChanges] = useState<SettingsValue>(settings!);

    useEffect(() => {
        if (isSuccess) {
            setIsSaving(false);
            setChanges(settings!);
        }
    }, [isSuccess, settings]);

    const onSavePress = useCallback(() => {
        setIsSaving(true);
        saveSettings(changes);
    }, [changes, saveSettings]);

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

    const hasPendingChanges = useMemo(() => {
        return JSON.stringify(changes) !== JSON.stringify(settings);
    }, [changes, settings]);

    return {
        isSaving,
        onSavePress,
        handleInputChange,
        hasPendingChanges,
        changes,
    };
}
