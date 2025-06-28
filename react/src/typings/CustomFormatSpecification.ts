import { type Provider } from './Provider';

export interface CustomFormatSpecification extends Provider {
    negate: boolean;
    required: boolean;
}
