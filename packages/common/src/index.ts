export interface SocketProps {
    userId: string;
    roomId: string;
}

export interface SocketUserEmitDataProps {
    userId: string;
}

export enum SocketEvents {
    UserRoomJoin = 'user-joined-the-room',
    UserDisconnected = 'user-disconnected',
    RoomConnection = 'room-connection',
}
