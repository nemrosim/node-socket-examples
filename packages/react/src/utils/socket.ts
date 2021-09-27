import { io } from 'socket.io-client';

const connectionOptions = {
    forceNew: true,
    reconnectionAttempts: 5,
    timeout: 10000,
    transports: ['websocket'],
};

export const socket = io(`${process.env.REACT_APP_WDS_SOCKET_HOST}`, connectionOptions);
