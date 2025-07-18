import type { LocalStorage } from './setupLocalStorage';

export default function getLocalStorage() {
    return JSON.parse(localStorage.getItem('kapowarr') ?? '') as LocalStorage;
}
