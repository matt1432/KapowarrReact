// IMPORTS

// React
import { useMemo } from 'react';

// Redux
import { useRootSelector } from 'Store/createAppStore';

// Specific Components
import Message, { type Message as MessageModel } from '../Message';

// CSS
import styles from './index.module.css';

// IMPLEMENTATIONS

export default function Messages() {
    const items = useRootSelector((state) => state.messages.items);

    const messages = useMemo(() => {
        return items.reduce<MessageModel[]>((acc, item) => {
            acc.unshift(item);

            return acc;
        }, []);
    }, [items]);

    return (
        <div className={styles.messages}>
            {messages.map((message) => {
                return <Message key={message.id} {...message} />;
            })}
        </div>
    );
}
