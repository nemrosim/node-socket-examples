import { io } from 'socket.io-client';
import Peer from 'peerjs';

console.log('ENVs', process.env);

/**
 * If your front is served on the same domain as your server, you can simply use:
 */
export const socket = io(
    `${process.env.REACT_APP_WDS_SOCKET_HOST}:${process.env.REACT_APP_WDS_SOCKET_PORT}`,
);

const useCloudPeerServer = false;
const generateUniqueId = true;

const peerOptions = {
    host: process.env.REACT_APP_PEER_HOST || 'http://localhost',
    port: process.env.REACT_APP_PEER_PORT ? parseInt(process.env.REACT_APP_PEER_PORT, 10) : 9000,
    path: process.env.REACT_APP_PEER_PATH || '/myapp',
    secure: Boolean(process.env.REACT_APP_PEER_SECURE), // need SSL
};

console.log('PEER OPTION', peerOptions);

/**
 * If you will not pass an "id" prop - peer js server will return you a unique ID
 * If you will not pass an "options" prop - cloud peer js server will be used
 */
export const peer = new Peer(
    generateUniqueId ? undefined : '123',
    useCloudPeerServer ? undefined : peerOptions,
);
