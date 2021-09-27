import React, { useEffect } from 'react';
import { VideoStream } from '../../components';
import { SocketEvents, SocketProps, SocketUserEmitDataProps } from '@nemrosim/web-rtc-common-types';
import { useParams } from 'react-router-dom';
import { useSocketPeerContext } from '../../contexts';
import { peer } from '../../utils/peer';
import { socket } from '../../utils/socket';
import './VideoChat.css';

const mediaConstraints = {
    video: true,
    audio: false,
};

export const VideoChat: React.FC = () => {
    const { socketError, isSocketConnected, currentUserId, streams, setStreams } =
        useSocketPeerContext();
    const { roomId } = useParams<{ roomId: string }>();

    useEffect(() => {
        if (roomId && currentUserId) {
            socket.emit(SocketEvents.RoomConnection, {
                userId: currentUserId,
                roomId,
            } as SocketProps);

            navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
                setStreams((prevState) => [...prevState, { stream, id: currentUserId }]);
            });
        }

        return () => {
            setStreams([]);
        };
    }, [roomId, currentUserId, setStreams]);

    useEffect(() => {
        socket.on(SocketEvents.UserRoomJoin, ({ userId }: SocketUserEmitDataProps) => {
            navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
                const mediaConnection = peer.call(userId, stream);

                mediaConnection.on('stream', (stream) => {
                    setStreams((prevState) => [...prevState, { stream, id: userId }]);
                });
            });

            // setConnectedUserIds((prevState) => [...prevState, userId]);
        });

        socket.on(SocketEvents.UserDisconnected, ({ userId }) => {
            setStreams((prevState) => {
                return prevState.filter((item) => item.id !== userId);
            });
        });

        /**
         * Another "peer" is calling to us
         * His id will be stored in "mediaConnection.peer" value
         * On his call - we are answering with our stream "mediaConnection.answer(stream)"
         * More info about media calls: https://github.com/peers/peerjs#media-calls
         */
        peer.on('call', (mediaConnection) => {
            navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
                mediaConnection.answer(stream);
            });

            mediaConnection.on('stream', (remoteStream) => {
                const peerUserId = mediaConnection.peer;
                const streamAlreadyExist = streams.find((item) => item.id === peerUserId);

                if (!streamAlreadyExist) {
                    setStreams((prevState) => [
                        ...prevState,
                        { stream: remoteStream, id: peerUserId },
                    ]);
                }
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
            <div className="VideoChat">
                <div className="VideoStreamContainer">
                    {streams.map((e) => {
                        return <VideoStream key={e.id} stream={e.stream} id={e.id} />;
                    })}
                </div>
            </div>
        );
    }

    return <div>No streams</div>;
};
