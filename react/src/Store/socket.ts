import { io } from 'socket.io-client';

const socket = io({
    path: `${window.Kapowarr.urlBase}/api/socket.io`,
    transports: ['polling'],
    upgrade: false,
    closeOnBeforeunload: true,
});

export default socket;
