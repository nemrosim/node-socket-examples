import React, { useEffect, useRef } from 'react';
import { VideoStreamProps } from './types';
import './VideoStream.css';
import { useSocketPeerContext } from '../../contexts';

export const VideoStream: React.FC<VideoStreamProps> = ({ stream, id }) => {
    const { currentUserId } = useSocketPeerContext();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }

        return () => {
            stream.getTracks().forEach((e) => {
                e.stop();
            });
        };
    }, [videoRef, stream]);

    return (
        <div className="VideoStream">
            <h1>User id: {id}</h1>
            <video
                style={{
                    border: '2px solid',
                    borderColor: currentUserId === id ? 'green' : 'none',
                }}
                id={id}
                muted={true}
                controls={true}
                ref={videoRef}
                onLoadedMetadata={() => {
                    videoRef?.current?.play();
                }}
            />
        </div>
    );
};
