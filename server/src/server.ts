import * as http from 'http';
import { WebSocketServer } from 'ws';
import { ILedMessageData, IScoreData, MessageHeader } from './utils/model/MessageData.model';

const wsPort = 3100;
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

const broadcastJSON = (message: IScoreData | ILedMessageData) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}

function getDistribution(newValue: number, avg: number) {
    if (newValue < avg - 100) {
        return 'green';
    } else if (newValue > avg + 100) {
        return 'red';
    } else {
        return 'yellow';
    }
}

wss.on('connection', function (client, request) {
    console.log('new client');
});
const debug = async () => {
    let accScore = 0;
    let nbScore = 0;

    const distrib = {
        red: 0,
        yellow: 0,
        green: 0
    }

    const ledAction = async function () {
        return new Promise((resolve) => {
            setTimeout(() => {
                broadcastJSON({
                    type: MessageHeader.LED,
                    curLed: Math.floor(Math.random() * 3),
                    date: 0
                });
                resolve(true);
            }, 2000);
        });
    }
    const scoreAction = async function () {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCurTime = 300 + Math.round(Math.random() * 500);
                accScore += newCurTime;
                nbScore++;
                const avgTime = Math.round(accScore / nbScore);
                const newDistribKey = getDistribution(newCurTime, avgTime);
                distrib[newDistribKey]++;
                broadcastJSON({
                    type: MessageHeader.SCORE,
                    curTime: newCurTime,
                    avgTime,
                    distribution: distrib,
                    date: 0,
                });
                resolve(true);
            }, 500 + Math.round(Math.random() * 100));
        });
    }
    while (true) {
        await ledAction();
        await scoreAction();
    }
};

debug();