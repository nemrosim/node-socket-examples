import { io } from 'socket.io-client';
import Peer from 'peerjs';

/**
 * If your front is served on the same domain as your server, you can simply use:
 */
export const socket = io('http://localhost:3001');

const useCloudPeerServer = false;
const generateUniqueId = true;

const peerOptions = {
    host: 'localhost',
    port: 9000,
    path: '/myapp',
    secure: false, // need SSL
};

/**
 * If you will not pass an "id" prop - peer js server will return you a unique ID
 * If you will not pass an "options" prop - cloud peer js server will be used
 */
export const peer = new Peer(
    generateUniqueId ? undefined : '123',
    useCloudPeerServer ? undefined : peerOptions,
);
