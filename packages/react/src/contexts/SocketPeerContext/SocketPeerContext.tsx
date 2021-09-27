import React, { useContext, useEffect, useState } from 'react';
import { SocketPeerContextProps } from './types';
import { InitialState } from './initialState';
import { peer } from '../../utils/peer';
import { socket } from '../../utils/socket';

export const SocketPeerContext = React.createContext<SocketPeerContextProps>(InitialState);

export const SocketPeerContextProvider: React.FC = ({ children }) => {
    const [socketError, setSocketError] = useState<Error>();
    const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

    const [connectedUserIds, setConnectedUserIds] = useState<Array<string>>([]);
    const [disconnectedUserIds, setDisconnectedUserIds] = useState<Array<string>>([]);

    const [streams, setStreams] = useState<Array<{ stream: MediaStream; id: string }>>([]);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    useEffect(() => {
        socket.on('connect', () => {
            setIsSocketConnected(true);
        });
        socket.on('connect_error', (error) => {
            setSocketError(error);
        });
        peer.on('error', (error) => {
            console.error('Peer error', error);
        });
        peer.on('open', (id) => {
            setCurrentUserId(id);
        });
    }, []);

    return (
        <SocketPeerContext.Provider
            value={{
                socketError,
                setSocketError,
                isSocketConnected,
                currentUserId,
                setCurrentUserId,
                setIsSocketConnected,
                connectedUserIds,
                setConnectedUserIds,
                disconnectedUserIds,
                setDisconnectedUserIds,
                streams,
                setStreams,
            }}
        >
            {children}
        </SocketPeerContext.Provider>
    );
};

export const useSocketPeerContext = (): SocketPeerContextProps => {
    const context = useContext<SocketPeerContextProps>(SocketPeerContext);

    if (context === null) {
        throw new Error(
            '"useSocketPeerContext" should be used inside a "SocketPeerContextProvider"',
        );
    }

    return context;
};
