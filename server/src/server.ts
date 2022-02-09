import * as http from 'http';
import { WebSocketServer } from 'ws';
import * as SerialPort from 'serialport';

const wsPort = 3000;
const wsAdress = 'localhost';
const arduinoPort = 3000;
const arduinoCOMPort = '/dev/ttyACM0';

// Arduino connection setup
// const arduinoSerialPort = new SerialPort(arduinoCOMPort, { baudRate: 9600 });
// arduinoSerialPort.on('open', function () {
//     console.log(`Serial Port ${arduinoCOMPort} is opened.`);
// });

// WebSocket connection setup
const server = http.createServer();
server.listen(wsPort, wsAdress, () => {
    // @ts-ignore
    console.log('Listening on ' + server.address().address + ':' + server.address().port);
});
const wss = new WebSocketServer({ server });

const broadcastJSON = (message: string) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

wss.on('connection', function (client, request) {
    console.log('new client');
});