import React from 'react';

export interface SocketPeerContextProps {
    socketError?: Error;
    setSocketError: React.Dispatch<React.SetStateAction<Error | undefined>>;

    isSocketConnected: boolean;
    setIsSocketConnected: React.Dispatch<React.SetStateAction<boolean>>;

    currentUserId: string;
    setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;

    connectedUserIds: Array<string>;
    setConnectedUserIds: React.Dispatch<React.SetStateAction<Array<string>>>;

    disconnectedUserIds: Array<string>;
    setDisconnectedUserIds: React.Dispatch<React.SetStateAction<Array<string>>>;

    streams: Array<{ stream: MediaStream; id: string }>;
    setStreams: React.Dispatch<React.SetStateAction<Array<{ stream: MediaStream; id: string }>>>;
}
