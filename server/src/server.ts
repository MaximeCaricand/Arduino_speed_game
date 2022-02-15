import * as http from 'http';
import { WebSocketServer } from 'ws';
import { medianAvgOffset, Message, MessageHeader } from './database/models/MessageData.model';
import { connectDB, GameResultService } from './database/index';
import { DistributionKey, GameResult } from './database/models/GameResul.model';
import SerialPort = require("serialport");

const Readline = require('@serialport/parser-readline');

const wsPort = 3100;
const dbPort = 27017;
const selectedArdCOMPort = '/dev/ttyACM0';

(async () => {
    // Mongo setup
    console.log(await connectDB(dbPort));

    // Arduino connection setup
    const arduinoSerialPort = new SerialPort(selectedArdCOMPort, { baudRate: 9600 });
    arduinoSerialPort.on('open', function () {
        console.log(`[Serial Port] ${selectedArdCOMPort} is opened.`);
    });
    const parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', (message: string) => { handleNewMessage(message, Date.now()); });

    // Websocket setup
    const server = http.createServer();
    // @ts-ignore
    server.listen(wsPort, () => console.log('[WS] Listening on ' + server.address().address + ':' + server.address().port));
    const wss = new WebSocketServer({ server });
    wss.on('connection', () => console.log('new client'));

    // broadcast a json to all connected clients
    function broadcastJSON(message: Message) {
        wss.clients.forEach(client => {
            client.send(JSON.stringify(message));
        });
    }

    // handle new message from arduino
    function handleNewMessage(message: string, date: number) {
        const messageData = message.split(';');
        switch (messageData[0]) {
            case MessageHeader.LED:
                return broadcastJSON({ type: MessageHeader.LED, curLed: +messageData[1] });
            case MessageHeader.SCORE:
                return handleNewScore(+messageData[1], date);
            case MessageHeader.STOP:
                return broadcastJSON({ type: MessageHeader.STOP });
        }
    }

    async function handleNewScore(score: number, date: number) {

        // fetch average score and distribution from all db items
        const queryResult = (await GameResultService.getScoreAvgAndDistribution());
        const avgScore = queryResult.avg ?? score;
        const category = getDistributionKey(score, avgScore);
        const distribution = {
            green: queryResult.green,
            yellow: queryResult.yellow,
            red: queryResult.red
        }
        distribution[category]++; // increase distribution with the new score

        // Put new score item in db
        await GameResultService.createGameResult(new GameResult({ score, category, datetime: date }));

        // send led color back to arduino
        arduinoSerialPort.write(category.charAt(0), 'ascii');

        // update frontend
        broadcastJSON({ type: MessageHeader.SCORE, score, avgScore, distribution });
    }

    function getDistributionKey(newValue: number, avg: number) {
        if (newValue < avg - medianAvgOffset) {
            return DistributionKey.GREEN;
        } else if (newValue > avg + medianAvgOffset) {
            return DistributionKey.RED;
        } else {
            return DistributionKey.YELLOW;
        }
    }

    // allow to test without the arduino board
    async function debug() {
        const stopAction = async function () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    handleNewMessage(`${MessageHeader.STOP}`, Date.now());
                    resolve(true);
                }, 2000);
            });
        }
        const ledAction = async function () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    handleNewMessage(`${MessageHeader.LED};${Math.floor(Math.random() * 3)}`, Date.now());
                    resolve(true);
                }, 2000);
            });
        }
        const scoreAction = async function () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    handleNewMessage(`${MessageHeader.SCORE};${300 + Math.round(Math.random() * 500)}`, Date.now());
                    resolve(true);
                }, 300 + Math.round(Math.random() * 100));
            });
        }
        let cpt = 0;
        while (true) {
            if (cpt > 5) {
                cpt = 0;
                await stopAction();
            }
            await ledAction();
            await scoreAction();
            cpt++
        }
    };
    // debug();
})();







