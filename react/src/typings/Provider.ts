import type { ModelBase } from 'App/ModelBase';
import type { Kind } from 'Helpers/Props/kinds';
import type { Field } from './Field';

export interface ProviderMessage {
    message: string;
    type: Extract<Kind, 'info' | 'error' | 'warning'>;
}

export interface Provider extends ModelBase {
    name: string;
    fields: Field[];
    implementationName: string;
    implementation: string;
    configContract: string;
    infoLink: string;
    message: ProviderMessage;
}
