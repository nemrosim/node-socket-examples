import { SocketPeerContextProps } from './types';

export const InitialState: SocketPeerContextProps = {
    socketError: undefined,
    setSocketError: () => undefined,

    isSocketConnected: false,
    setIsSocketConnected: () => undefined,

    currentUserId: '',
    setCurrentUserId: () => undefined,

    streams: [],
    setStreams: () => undefined,
};
