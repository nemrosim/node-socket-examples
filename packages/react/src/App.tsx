import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { VideoChat, Welcome } from './pages';
import { SocketPeerContextProvider } from './contexts';

export const App = () => {
    return (
        <SocketPeerContextProvider>
            <Router>
                <Route exact={true} path="/" component={Welcome} />
                <Route exact={true} path="/:roomId" component={VideoChat} />
            </Router>
        </SocketPeerContextProvider>
    );
};
