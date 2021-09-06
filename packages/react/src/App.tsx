import React, { useEffect, useRef, useState } from 'react';
import { SocketEvents, SocketProps, SocketUserEmitDataProps } from '@nemrosim/web-rtc-common-types';
import { peer, socket } from './utils';
import { ROOM_ID, REMOTE_STREAM_VIDEO_ELEMENT } from './constants';

const UsersStatus: React.FC<{ connectedUserIds: string[]; disconnectedUserIds: string[] }> = ({
    connectedUserIds,
    disconnectedUserIds,
}) => {
    return (
        <>
            {connectedUserIds.map((connectedUserId) => {
                const isUserOffline = disconnectedUserIds.find(
                    (userId) => userId === connectedUserId,
                );

                return (
                    <h1 key={connectedUserId}>{`User ${connectedUserId} is ${
                        isUserOffline ? 'Offline' : 'Online'
                    }`}</h1>
                );
            })}
        </>
    );
};

export const App: React.FC = () => {
    const [connectedUserIds, setConnectedUserIds] = useState<Array<string>>([]);
    const [disconnectedUserIds, setDisconnectedUserIds] = useState<Array<string>>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoListRef = useRef<HTMLDivElement>(null);

    const handleVideoChatConnections = async () => {
        /**
         * 1.
         */
        peer.on('open', (id) => {
            console.log('Peer. open USER id', id);
            socket.emit(SocketEvents.RoomConnection, {
                userId: id,
                roomId: ROOM_ID,
            } as SocketProps);
        });

        /**
         * 2.
         */
        socket.on(SocketEvents.UserDisconnected, ({ userId }) => {
            const userIdVideo = document.getElementById(userId);
            userIdVideo?.remove();

            const remoteStreamVideo = document.getElementById(REMOTE_STREAM_VIDEO_ELEMENT);
            remoteStreamVideo?.remove();

            setDisconnectedUserIds((prevState) => [...prevState, userId]);
        });

        /**
         * 3.
         */
        socket.on(SocketEvents.UserRoomJoin, ({ userId }: SocketUserEmitDataProps) => {
            console.log('User joined the room', userId);
            const mediaConnection = peer.call(userId, stream);

            mediaConnection.on('stream', (stream) => {
                console.log('Media connection', stream);
                const video = document.createElement('video');
                video.srcObject = stream;
                video.id = userId;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });

                videoListRef.current?.append(video);
            });

            setConnectedUserIds((prevState) => [...prevState, userId]);
        });

        /**
         * 4.
         */
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        /**
         * 5.
         */
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        /**
         * 6.
         * More info about media calls: https://github.com/peers/peerjs#media-calls
         */
        peer.on('call', (mediaConnection) => {
            mediaConnection.answer(stream);
            const video = document.createElement('video');

            mediaConnection.on('stream', (remoteStream) => {
                // we will receive a stream from other users
                video.id = 'remote-stream-video';
                video.srcObject = remoteStream;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });

                videoListRef.current?.append(video);
            });

            mediaConnection.on('close', () => {
                // THIS WILL NOT TRIGGER ! Issue related to "peer js lib"
                // video.remove();
            });
        });
    };

    useEffect(() => {
        handleVideoChatConnections();
    }, []);

    return (
        <div>
            <video
                ref={videoRef}
                muted={true}
                controls={true}
                style={{
                    border: '10px solid red',
                }}
                onLoadedMetadata={() => {
                    videoRef.current?.play();
                }}
            />
            <div
                ref={videoListRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '300px',
                }}
            />
            <UsersStatus
                connectedUserIds={connectedUserIds}
                disconnectedUserIds={disconnectedUserIds}
            />
        </div>
    );
};
