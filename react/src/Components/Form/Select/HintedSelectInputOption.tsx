// IMPORTS

// React
import React from 'react';

// Misc
import classNames from 'classnames';

// Specific Components
import EnhancedSelectInputOption, {
    type EnhancedSelectInputOptionProps,
} from './EnhancedSelectInputOption';

// CSS
import styles from './HintedSelectInputOption.module.css';

// Types
interface HintedSelectInputOptionProps extends Omit<EnhancedSelectInputOptionProps, 'isSelected'> {
    value: string;
    hint?: React.ReactNode;
    isSelected?: boolean;
}

// IMPLEMENTATIONS

function HintedSelectInputOption(props: HintedSelectInputOptionProps) {
    const { id, value, hint, depth, isSelected = false, isMobile, ...otherProps } = props;

    return (
        <EnhancedSelectInputOption
            id={id}
            depth={depth}
            isSelected={isSelected}
            isMobile={isMobile}
            {...otherProps}
        >
            <div className={classNames(styles.optionText, isMobile && styles.isMobile)}>
                <div>{value}</div>

                {hint != null && <div className={styles.hintText}>{hint}</div>}
            </div>
        </EnhancedSelectInputOption>
    );
}

export default HintedSelectInputOption;
