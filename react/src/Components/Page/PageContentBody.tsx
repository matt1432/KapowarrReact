// IMPORTS

// React
import { type ForwardedRef, forwardRef, type ReactNode, useCallback } from 'react';

// Misc
import { isLocked } from 'Utilities/scrollLock';

// General Components
import Scroller, { type OnScroll } from 'Components/Scroller/Scroller';

// CSS
import styles from './PageContentBody.module.css';

// Types
interface PageContentBodyProps {
    className?: string;
    innerClassName?: string;
    children: ReactNode;
    initialScrollTop?: number;
    onScroll?: (payload: OnScroll) => void;
}

// IMPLEMENTATIONS

const PageContentBody = forwardRef(
    (props: PageContentBodyProps, ref: ForwardedRef<HTMLDivElement>) => {
        const {
            className = styles.contentBody,
            innerClassName = styles.innerContentBody,
            children,
            onScroll,
            ...otherProps
        } = props;

        const onScrollWrapper = useCallback(
            (payload: OnScroll) => {
                if (onScroll && !isLocked()) {
                    onScroll(payload);
                }
            },
            [onScroll],
        );

        return (
            <Scroller
                ref={ref}
                {...otherProps}
                className={className}
                scrollDirection="vertical"
                onScroll={onScrollWrapper}
            >
                <div className={innerClassName}>{children}</div>
            </Scroller>
        );
    },
);

export default PageContentBody;
