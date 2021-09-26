import Peer from 'peerjs';

const useCloudPeerServer = false;
const generateUniqueId = true;

const peerOptions = {
    host: process.env.REACT_APP_PEER_HOST,
    port: parseInt(process.env.REACT_APP_PEER_PORT || '9000', 10),
    path: process.env.REACT_APP_PEER_PATH || '/myapp',
    secure: process.env.REACT_APP_PEER_SECURE === 'true', // need SSL
};

/**
 * If you will not pass an "id" prop - peer js server will return you a unique ID
 * If you will not pass an "options" prop - cloud peer js server will be used
 */
export const peer = new Peer(
    generateUniqueId ? undefined : '123',
    useCloudPeerServer ? undefined : peerOptions,
);
