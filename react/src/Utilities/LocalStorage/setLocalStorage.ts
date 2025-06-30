import getLocalStorage from './getLocalStorage';
import type { LocalStorage } from './setupLocalStorage';

export default function setLocalStorage(
    updates: Partial<LocalStorage>,
    _localKapowarr?: LocalStorage,
) {
    const localKapowarr = _localKapowarr ?? getLocalStorage();

    Object.assign(localKapowarr, updates);

    localStorage.setItem('kapowarr', JSON.stringify(localKapowarr));
}
