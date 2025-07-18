// IMPORTS

// Specific Components
import TextInput, { type TextInputProps } from './TextInput';

// Types
import type { SyntheticEvent } from 'react';

// IMPLEMENTATIONS

// Prevent a user from copying (or cutting) the password from the input
function onCopy(e: SyntheticEvent) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
}

function PasswordInput(props: TextInputProps) {
    return <TextInput {...props} type="password" onCopy={onCopy} />;
}

export default PasswordInput;
