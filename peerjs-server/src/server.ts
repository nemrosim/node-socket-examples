import { PeerServer } from 'peer';
const server = PeerServer({ port: 9000, path: '/myapp' });

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
