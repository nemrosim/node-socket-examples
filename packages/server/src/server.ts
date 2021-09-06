import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { SocketProps, SocketUserEmitDataProps, SocketEvents } from '@nemrosim/web-rtc-common-types';
import healthRoute from './routes/health';

const app = express();

const httpServer = http.createServer(app);

console.log('ENV', process.env);

const io = new Server(httpServer, {
    cors: {
        /**
         * Our React app will be running on this route
         */
        origin: process.env.REACT_APP_HOST
            ? `https://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_POST}`
            : 'http://localhost:3006',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    /**
     * This event will be called when client "emits" RoomConnection event
     */
    socket.on(SocketEvents.RoomConnection, ({ userId, roomId }: SocketProps) => {
        /**
         * This means that you "sent" messages only to that users that are in the current "room"
         */
        socket.join(roomId);

        /**
         * Send message everyone in the "room".
         */
        socket.broadcast.to(roomId).emit(SocketEvents.UserRoomJoin, {
            userId,
        } as SocketUserEmitDataProps);

        /**
         * ⚠️ NOTE: This is a workaround!
         * "close" event of the "peer.js" package has an issue:
         * "close" will not be triggered when user disconnects
         * https://stackoverflow.com/questions/64651890/peerjs-close-video-call-not-firing-close-event/66518772#66518772
         */
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit(SocketEvents.UserDisconnected, {
                userId,
            } as SocketUserEmitDataProps);
        });
    });
});

app.use(cors());
app.use(healthRoute);

const PORT = process.env.PORT || 3001;
const listeningListener = () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
};

httpServer.listen(PORT, listeningListener);
