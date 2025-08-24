// TODO: figure out form validation

export interface ValidationFailure {
    isWarning: boolean;
    propertyName: string;
    errorMessage: string;
    infoLink?: string;
    detailedDescription?: string;
    severity: 'error' | 'warning';
}

export interface ValidationError extends ValidationFailure {
    isWarning: false;
}

export interface ValidationWarning extends ValidationFailure {
    isWarning: true;
}

export interface Failure {
    errorMessage: ValidationFailure['errorMessage'];
    infoLink: ValidationFailure['infoLink'];
    detailedDescription: ValidationFailure['detailedDescription'];
}
