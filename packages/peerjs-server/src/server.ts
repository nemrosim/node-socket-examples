import { PeerServer } from 'peer';
const server = PeerServer({
    port: (process.env.PORT && parseInt(process.env.PORT, 10)) || 9000,
    path: '/myapp',
});

server.on('connection', function (client) {
    console.log('PEER: Connected id:', client.getId());
});

server.on('disconnect', function (client) {
    console.log('PEER: Disconnected. ID:', client.getId());
});

server.on('message', (data) => {
    // console.log('messsage');
});

server.on('error', (error) => {
    console.log('Error', error);
});

server.listen();
