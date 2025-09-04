// IMPORTS

// CSS
import styles from './index.module.css';

// Types
interface LoadingIndicatorProps {
    className?: string;
    rippleClassName?: string;
    size?: number;
}

// IMPLEMENTATIONS

export default function LoadingIndicator({
    className = styles.loading,
    rippleClassName = styles.ripple,
    size = 50,
}: LoadingIndicatorProps) {
    const sizeInPx = `${size}px`;
    const width = sizeInPx;
    const height = sizeInPx;

    return (
        <div className={className} style={{ height }}>
            <div className={styles.rippleContainer} style={{ width, height }}>
                <div className={rippleClassName} style={{ width, height }} />

                <div className={rippleClassName} style={{ width, height }} />

                <div className={rippleClassName} style={{ width, height }} />
            </div>
        </div>
    );
}
