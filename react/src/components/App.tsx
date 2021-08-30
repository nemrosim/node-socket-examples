import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

const ROOM_ID = 'SOME_RANDOM_ROOM_ID';

export const App = () => {
    const [connectedUserIds, setConnectedUserIds] = useState<Array<string>>([]);

    const searchParams = new URLSearchParams(window.location.search);
    const currentUserId = searchParams.get('userId');

    useEffect(() => {
        let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
        if (currentUserId) {
            const peer = new Peer(currentUserId, {
                host: 'localhost',
                port: 9000,
                path: '/myapp',
            });
            console.log('PEER', peer);
            socket = io('http://localhost:3001');
            socket.emit('any-name-you-like', ROOM_ID, currentUserId);
            socket.on('user-connected', (userId: string) => {
                console.log('New user connected. ID -> ', userId);
                setConnectedUserIds([userId, ...connectedUserIds]);
            });
        }

        return () => {
            socket?.disconnect();
        };
    }, [currentUserId]);

    return (
        <div>
            <h2>User ID: {currentUserId}</h2>
            {connectedUserIds.map((connectedUserId) => {
                return <h2>Connected User ID: {connectedUserId}</h2>;
            })}
        </div>
    );
};
