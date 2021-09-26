import React from 'react';
import { useSocketPeerContext } from '../contexts';

export const UsersStatus: React.FC = () => {
    const { connectedUserIds, disconnectedUserIds } = useSocketPeerContext();

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
