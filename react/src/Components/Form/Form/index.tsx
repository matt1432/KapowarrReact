// IMPORTS

// Misc
import { kinds } from 'Helpers/Props';

// General Components
import Alert from 'Components/Alert';

// CSS
import styles from './index.module.css';

// Types
import type { ReactNode } from 'react';
import type { ValidationError, ValidationWarning } from 'typings/pending';

export interface FormProps {
    id?: string;
    children: ReactNode;
    validationErrors?: ValidationError[];
    validationWarnings?: ValidationWarning[];
}

// IMPLEMENTATIONS

function Form({ id, children, validationErrors = [], validationWarnings = [] }: FormProps) {
    return (
        <div id={id}>
            {validationErrors.length || validationWarnings.length ? (
                <div className={styles.validationFailures}>
                    {validationErrors.map((error, index) => {
                        return (
                            <Alert key={index} kind={kinds.DANGER}>
                                {error.errorMessage}
                            </Alert>
                        );
                    })}

                    {validationWarnings.map((warning, index) => {
                        return (
                            <Alert key={index} kind={kinds.WARNING}>
                                {warning.errorMessage}
                            </Alert>
                        );
                    })}
                </div>
            ) : null}

            {children}
        </div>
    );
}

export default Form;
