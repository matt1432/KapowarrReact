// IMPORTS

// React
import React, { useCallback, useEffect } from 'react';

// Misc
import useSelectState from 'Helpers/Hooks/useSelectState';

// Types
import type { SelectState, SelectStateModel } from 'Helpers/Hooks/useSelectState';

export type SelectContextAction =
    | { type: 'reset' }
    | { type: 'selectAll' }
    | { type: 'unselectAll' }
    | {
          type: 'toggleSelected';
          id: number | string;
          isSelected: boolean | null;
          shiftKey: boolean;
      }
    | {
          type: 'removeItem';
          id: number | string;
      }
    | {
          type: 'updateItems';
          items: { id: number }[];
      };

export type SelectDispatch = (action: SelectContextAction) => void;

interface SelectProviderOptions<T extends SelectStateModel> {
    children: React.ReactNode;
    items: Array<T>;
}

// IMPLEMENTATIONS

const SelectContext = React.createContext<[SelectState, SelectDispatch] | undefined>(
    structuredClone(undefined),
);

export function SelectProvider<T extends SelectStateModel>({
    children,
    items,
}: SelectProviderOptions<T>) {
    const [state, dispatch] = useSelectState();

    const dispatchWrapper = useCallback(
        (action: SelectContextAction) => {
            switch (action.type) {
                case 'reset':
                case 'removeItem':
                    dispatch(action);
                    break;

                default:
                    dispatch({
                        ...action,
                        items,
                    });
                    break;
            }
        },
        [items, dispatch],
    );

    const value: [SelectState, SelectDispatch] = [state, dispatchWrapper];

    useEffect(() => {
        dispatch({ type: 'updateItems', items });
    }, [items, dispatch]);

    return <SelectContext.Provider value={value}>{children}</SelectContext.Provider>;
}

// eslint-disable-next-line
export function useSelect() {
    const context = React.useContext(SelectContext);

    if (context === undefined) {
        throw new Error('useSelect must be used within a SelectProvider');
    }

    return context;
}
