import { useCallback, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import type { Volume } from './Volumes';

function getUrl(volume: Volume) {
    const { apiKey, urlBase } = window.Kapowarr;
    return `${urlBase}/api/volumes/${volume.id}/cover?api_key=${apiKey}`;
}

export interface VolumesImageProps {
    volume: Volume;
    className?: string;
    style?: object;
    placeholder: string;
    size?: number;
    lazy?: boolean;
    // overflow?: boolean;
    onError?: () => void;
    onLoad?: () => void;
}

function VolumesImage({
    volume,
    className,
    style,
    placeholder,
    size = 250,
    lazy = true,
    // overflow = false,
    onError,
    onLoad,
}: VolumesImageProps) {
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
                placeholder={<img className={className} style={style} src={placeholder} />}
                // overflow={true} FIXME: see if necessary
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

export default VolumesImage;
