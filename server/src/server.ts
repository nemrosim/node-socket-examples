import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import healthRoute from './routes/health';

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        // client host
        origin: 'http://localhost:3006',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('any-name-you-like', (roomId, userId) => {
        console.log('SOCKET > Incoming socket data', { roomId, userId });
        socket.join(roomId);
        // Send everyone in the room but don't send back
        socket.broadcast.to(roomId).emit('user-connected', userId);
    });
});

app.use(cors());
app.use(healthRoute);

const PORT = 3001;
const listeningListener = () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
};

httpServer.listen(PORT, listeningListener);
