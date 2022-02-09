import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocket('ws://localhost', { port: '4200' });

wss.on('open', () => {
    console.log('open');
});