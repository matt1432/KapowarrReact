// IMPORTS

// React
// import { useMemo } from 'react';

// Redux
// import { useSelector } from 'react-redux';

// Specific Components
// import Message from './Message';

// CSS
import styles from './Messages.module.css';

// IMPLEMENTATIONS

function Messages() {
    /* const items = useSelector((state: AppState) => state.app.messages.items);

    const messages = useMemo(() => {
        return items.reduce<MessageModel[]>((acc, item) => {
            acc.unshift(item);

            return acc;
        }, []);
    }, [items]);
    */

    return (
        <div className={styles.messages}>
            {/*messages.map((message) => {
                return <Message key={message.id} {...message} />;
            })*/}
        </div>
    );
}

export default Messages;
