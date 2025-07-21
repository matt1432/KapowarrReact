export type SortDirection = 'ascending' | 'descending';

const ASCENDING: SortDirection = 'ascending';
const DESCENDING: SortDirection = 'descending';

const all: SortDirection[] = [ASCENDING, DESCENDING];

export const sortDirections = {
    ASCENDING,
    DESCENDING,
    all,
};

export default sortDirections;
