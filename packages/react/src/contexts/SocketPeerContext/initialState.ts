import { SocketPeerContextProps } from './types';

export const InitialState: SocketPeerContextProps = {
    socketError: undefined,
    setSocketError: () => undefined,

    isSocketConnected: false,
    setIsSocketConnected: () => undefined,

    currentUserId: '',
    setCurrentUserId: () => undefined,

    connectedUserIds: [],
    setConnectedUserIds: () => undefined,

    streams: [],
    setStreams: () => undefined,

    disconnectedUserIds: [],
    setDisconnectedUserIds: () => undefined,
};
