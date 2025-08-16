export const sortDirections = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
} as const;

export default sortDirections;

export type SortDirection = (typeof sortDirections)[keyof typeof sortDirections];
