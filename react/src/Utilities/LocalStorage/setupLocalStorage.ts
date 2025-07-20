import getLocalStorage from './getLocalStorage';
import setLocalStorage from './setLocalStorage';

export interface LocalStorage {
    theme: 'light' | 'dark' | 'auto';
    apiKey: string | null;
    lastLogin: number;
}

const defaultValues: LocalStorage = {
    theme: 'dark',
    apiKey: null,
    lastLogin: 0,
};

export default function setupLocalStorage() {
    let localKapowarr = getLocalStorage();

    if (Object.entries(localKapowarr).length === 0) {
        localStorage.setItem('kapowarr', JSON.stringify(defaultValues));
        localKapowarr = getLocalStorage();
    }

    const missingKeys = Object.keys(defaultValues).filter(
        (e) => !Object.keys(localKapowarr).includes(e),
    ) as (keyof LocalStorage)[];

    if (missingKeys.length !== 0) {
        const updates = {} as Partial<LocalStorage>;

        missingKeys.forEach((missingKey) => {
            Object.assign(updates, { [missingKey]: defaultValues[missingKey] });
        });

        setLocalStorage(updates, localKapowarr);
    }
}
