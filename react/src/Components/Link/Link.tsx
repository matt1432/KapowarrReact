import classNames from 'classnames';
import {
    type ComponentPropsWithoutRef,
    type ElementType,
    type SyntheticEvent,
    useCallback,
} from 'react';
import styles from './Link.module.css';

export type LinkProps<C extends ElementType = 'button'> = ComponentPropsWithoutRef<C> & {
    component?: C;
    to?: string;
    target?: string;
    isDisabled?: LinkProps<C>['disabled'];
    onPress?(event: SyntheticEvent): void;
};

export default function Link<C extends ElementType = 'button'>({
    className,
    component,
    to,
    target,
    type,
    isDisabled,
    onPress,
    ...otherProps
}: LinkProps<C>) {
    const Component = component || 'button';

    const onClick = useCallback(
        (event: SyntheticEvent) => {
            if (isDisabled) {
                return;
            }

            onPress?.(event);
        },
        [isDisabled, onPress],
    );

    const linkClass = classNames(
        className,
        styles.link,
        to && styles.to,
        isDisabled && 'isDisabled',
    );

    if (to) {
        const toLink = /\w+?:\/\//.test(to);

        return (
            <a
                href={to}
                target={target || (toLink ? '_blank' : '_self')}
                rel={toLink ? 'noreferrer' : undefined}
                className={linkClass}
                onClick={onClick}
                {...otherProps}
            />
        );
    }

    return (
        <Component
            type={component === 'button' || component === 'input' ? type || 'button' : type}
            target={target}
            className={linkClass}
            disabled={isDisabled}
            onClick={onClick}
            {...otherProps}
        />
    );
}
