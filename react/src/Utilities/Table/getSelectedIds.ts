import type { SelectedState } from 'Helpers/Hooks/useSelectState';

function getSelectedIds<T extends number | string = number>(
    selectedState: SelectedState,
    idParser: (id: string) => T = (id) => parseInt(id) as T,
): T[] {
    return Object.entries(selectedState).reduce((result: T[], [id, value]) => {
        if (value) {
            result.push(idParser(id));
        }

        return result;
    }, []);
}

export default getSelectedIds;
