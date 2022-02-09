import * as http from 'http';
import { WebSocketServer } from 'ws';
import * as SerialPort from 'serialport';
import { resolve } from 'path/posix';

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

const broadcastJSON = (message: MessageData) => {
    console.log(message)
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

wss.on('connection', function (client, request) {
    console.log('new client');
});
const debug = async () => {
    let accScore = 0;
    let nbScore = 0;

    const action = async function () {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCurTime = 300 + Math.round(Math.random() * 500);
                accScore += newCurTime;
                nbScore++;
                broadcastJSON({
                    curTime: newCurTime,
                    avgTime: Math.round(accScore / nbScore),
                    distribution: {
                        red: 0,
                        yellow: 0,
                        green: 0
                    }
                });
                resolve(true);
            }, 3000 + Math.round(Math.random() * 300));
        });
    }
    while (true) {
        await action();
    }
};

debug();

type MessageData = {
    curTime: number;
    avgTime: number;
    distribution: Distribution;
}

type Distribution = {
    red: number;
    yellow: number;
    green: number;
}
