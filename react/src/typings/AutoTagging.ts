import { type ModelBase } from 'App/ModelBase';
import { type Field } from './Field';

export interface AutoTaggingSpecification {
    id: number;
    name: string;
    implementation: string;
    implementationName: string;
    negate: boolean;
    required: boolean;
    fields: Field[];
}

export interface AutoTagging extends ModelBase {
    name: string;
    removeTagsAutomatically: boolean;
    tags: number[];
    specifications: AutoTaggingSpecification[];
}
