import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

export const App = () => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log('Search  params', searchParams.get('userId'));

    useEffect(() => {
        // PeerJS uses PeerServer for session metadata and candidate signaling.
        const userIdParams = searchParams.get('userId') as string;
        const peer = new Peer(userIdParams, {
            host: 'localhost',
            port: 9000,
            path: '/myapp',
        });
        const socket = io('http://localhost:3001');
        socket.emit('any-name-you-like', '123-123-123', 33);
        socket.on('user-connected', (userId) => {
            console.log('User connected -> ', userId);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <div>Demo</div>;
};
