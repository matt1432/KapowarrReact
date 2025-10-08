import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import {
    default as useMeasureHook,
    type Options,
    type RectReadOnly,
} from 'react-use-measure';

const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;

export type Measurements = RectReadOnly;

export default function useMeasure<
    T extends HTMLOrSVGElement = HTMLOrSVGElement,
>(
    options?: Omit<Options, 'polyfill'>,
): [(element: T | null) => void, RectReadOnly, () => void] {
    return useMeasureHook({
        polyfill: ResizeObserver,
        ...options,
    }) as [(element: T | null) => void, RectReadOnly, () => void];
}
