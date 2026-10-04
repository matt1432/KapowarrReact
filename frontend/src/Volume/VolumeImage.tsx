// IMPORTS

// React
import { useCallback, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

// Types
import type { Volume } from './Volume';
import type { AddVolume } from 'AddVolume/AddVolume';

export interface VolumeImageProps {
    volume: Volume | AddVolume | { id: number; lastCvFetch?: number };
    className?: string;
    style?: object;
    placeholder: string;
    size?: number;
    lazy?: boolean;
    onError?: () => void;
    onLoad?: () => void;
}

// IMPLEMENTATIONS

function getUrl(volume: VolumeImageProps['volume']) {
    const { apiKey, urlBase } = window.Kapowarr;

    if (!('id' in volume)) {
        return volume.coverLink;
    }

    // The cover changes when the volume is refreshed, so use the refresh time
    // as version to let the browser cache the cover until then
    const version =
        'lastCvFetch' in volume && volume.lastCvFetch
            ? `&v=${volume.lastCvFetch}`
            : '';

    return `${urlBase}/api/volumes/${volume.id}/cover?api_key=${apiKey}${version}`;
}

export default function VolumeImage({
    volume,
    className,
    style,
    placeholder,
    size = 250,
    lazy = true,
    onError,
    onLoad,
}: VolumeImageProps) {
    const url = getUrl(volume);

    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);

    const handleLoad = useCallback(() => {
        setHasError(false);
        setIsLoaded(true);
        onLoad?.();
    }, [setHasError, setIsLoaded, onLoad]);

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoaded(false);
        onError?.();
    }, [setHasError, setIsLoaded, onError]);

    if (hasError || !url) {
        return <img className={className} style={style} src={placeholder} />;
    }

    if (lazy) {
        return (
            <LazyLoadImage
                className={className}
                style={style}
                src={url}
                rel="noreferrer"
                onError={handleError}
                onLoad={handleLoad}
                height={size}
                threshold={100}
                placeholder={
                    <img
                        className={className}
                        style={style}
                        src={placeholder}
                    />
                }
            ></LazyLoadImage>
        );
    }

    return (
        <img
            className={className}
            style={style}
            src={isLoaded ? url : placeholder}
            onError={handleError}
            onLoad={handleLoad}
        />
    );
}
