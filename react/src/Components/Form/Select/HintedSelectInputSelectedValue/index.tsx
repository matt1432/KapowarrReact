// IMPORTS

// React
import { type ReactNode, useMemo } from 'react';

// General Components
import Label from 'Components/Label';

// Specific Components
import EnhancedSelectInputSelectedValue from '../EnhancedSelectInputSelectedValue';

// CSS
import styles from './index.module.css';

// Types
import type { IterableElement } from 'type-fest';

import type { EnhancedSelectInputValue } from '../EnhancedSelectInput';

interface HintedSelectInputSelectedValueProps<T, V> {
    selectedValue: V;
    values: T[];
    hint?: ReactNode;
    isMultiSelect?: boolean;
    includeHint?: boolean;
}

// IMPLEMENTATIONS

export default function HintedSelectInputSelectedValue<
    T extends EnhancedSelectInputValue<V>,
    V extends number | string,
>({
    selectedValue,
    values,
    hint,
    isMultiSelect = false,
    includeHint = true,
    ...otherProps
}: HintedSelectInputSelectedValueProps<T, V>) {
    const valuesMap = useMemo(() => {
        return new Map(values.map((v) => [v.key, v.value]));
    }, [values]);

    return (
        <EnhancedSelectInputSelectedValue className={styles.selectedValue} {...otherProps}>
            <div className={styles.valueText}>
                {isMultiSelect && Array.isArray(selectedValue)
                    ? selectedValue.map((key) => {
                          const v = valuesMap.get(key);

                          return <Label key={key}>{v ? v : key}</Label>;
                      })
                    : valuesMap.get(selectedValue as IterableElement<V>)}
            </div>

            {hint && includeHint ? <div className={styles.hintText}>{hint}</div> : null}
        </EnhancedSelectInputSelectedValue>
    );
}
