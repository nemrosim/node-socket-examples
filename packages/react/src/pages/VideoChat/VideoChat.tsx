import React, { useEffect } from 'react';
import { UsersStatus, VideoStream } from '../../components';
import { SocketEvents, SocketProps, SocketUserEmitDataProps } from '@nemrosim/web-rtc-common-types';
import { useParams } from 'react-router-dom';
import { REMOTE_STREAM_VIDEO_ELEMENT } from '../../constants';
import { useSocketPeerContext } from '../../contexts';
import { peer } from '../../utils/peer';
import { socket } from '../../utils/socket';

export const VideoChat = () => {
    const {
        socketError,
        isSocketConnected,
        setDisconnectedUserIds,
        currentUserId,
        streams,
        setStreams,
    } = useSocketPeerContext();
    const { roomId } = useParams<{ roomId: string }>();

    useEffect(() => {
        if (roomId && currentUserId) {
            socket.emit(SocketEvents.RoomConnection, {
                userId: currentUserId,
                roomId,
            } as SocketProps);

            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then((stream) => {
                    setStreams((prevState) => [...prevState, { stream, id: currentUserId }]);
                });
        }

        return () => {
            setStreams([]);
        };
    }, [roomId, currentUserId, setStreams]);

    useEffect(() => {
        /**
         * Use joined the room
         */
        socket.on(SocketEvents.UserRoomJoin, ({ userId }: SocketUserEmitDataProps) => {
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then((stream) => {
                    const mediaConnection = peer.call(userId, stream);

                    mediaConnection.on('stream', (stream) => {
                        setStreams((prevState) => [...prevState, { stream, id: userId }]);
                    });
                });

            // setConnectedUserIds((prevState) => [...prevState, userId]);
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
         * Another "peer" is calling to us
         * His id will be stored in "mediaConnection.peer" value
         * On his call - we are answering with our stream "mediaConnection.answer(stream)"
         *
         * 6.
         * More info about media calls: https://github.com/peers/peerjs#media-calls
         */
        peer.on('call', (mediaConnection) => {
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then((stream) => {
                    mediaConnection.answer(stream);
                });

            const peerUserId = mediaConnection.peer;

            mediaConnection.on('stream', (remoteStream) => {
                const streamAlreadyExist = streams.find((e) => e.id === peerUserId);

                !streamAlreadyExist &&
                    setStreams((prevState) => [
                        ...prevState,
                        { stream: remoteStream, id: peerUserId },
                    ]);
            });

            mediaConnection.on('close', () => {
                console.log("mediaConnection.on('close)");
                // THIS WILL NOT TRIGGER ! Issue related to "peer js lib"
                // video.remove();
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isSocketConnected) {
        return <div>Socket connecting</div>;
    }

    if (socketError) {
        return <div>Socket error</div>;
    }

    if (streams) {
        return (
            <>
                {currentUserId && <h1>Current user id: {currentUserId}</h1>}
                {streams.map((e) => {
                    return <VideoStream key={e.id} stream={e.stream} id={e.id} />;
                })}
                <UsersStatus />
            </>
        );
    }

    return <div>No streams</div>;
};
