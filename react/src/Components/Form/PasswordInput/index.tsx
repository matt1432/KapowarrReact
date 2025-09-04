// IMPORTS

// Specific Components
import TextInput, { type TextInputProps } from '../TextInput';

// Types
import type { SyntheticEvent } from 'react';

// IMPLEMENTATIONS

// Prevent a user from copying (or cutting) the password from the input
function onCopy(e: SyntheticEvent) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
}

export default function PasswordInput<K extends string>(props: TextInputProps<K, 'password'>) {
    return <TextInput {...props} type="password" onCopy={onCopy} />;
}
