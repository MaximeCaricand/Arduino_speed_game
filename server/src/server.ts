import * as http from 'http';
import { WebSocketServer } from 'ws';
import { ILedMessageData, IScoreData, medianAvgOffset, MessageHeader } from './database/models/MessageData.model';
import { connectDB, GameResultService } from './database/index';
import { DistributionKey, GameResult } from './database/models/GameResul.model';
import SerialPort = require("serialport");

const Readline = require('@serialport/parser-readline');

const wsPort = 3100;
const arduinoPort = 3200;
const dbPort = 27017;
const arduinoCOMPort = '/dev/ttyACM0';
var parser;

(async () => {
    // Mongo setup
    console.log(await connectDB(dbPort));

    // Arduino connection setup
    const arduinoSerialPort = new SerialPort(arduinoCOMPort, { baudRate: 9600 });
    arduinoSerialPort.on('open', function () {
        console.log(`[Serial Port] ${arduinoCOMPort} is opened.`);
    });
    
    parser = arduinoSerialPort.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', (message:string) => {handleNewMessage(message, Date.now());});

    const server = http.createServer();
    // @ts-ignore
    server.listen(wsPort, () => console.log('[WS] Listening on ' + server.address().address + ':' + server.address().port));
    const wss = new WebSocketServer({ server });
    wss.on('connection', () => console.log('new client'));

    function broadcastJSON(message: IScoreData | ILedMessageData) {
        wss.clients.forEach(client => {
            client.send(JSON.stringify(message));
        });
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

    function handleNewMessage(message: string, date: number) {
        const messageData = message.split(';');
        switch (messageData[0]) {
            case MessageHeader.LED:
                return handleNewLed(+messageData[1]);
            case MessageHeader.SCORE:
                return handleNewScore(+messageData[1], date);
        }
    }

    function handleNewLed(ledIndex: number) {
        broadcastJSON({ type: MessageHeader.LED, curLed: ledIndex });
    }

    async function handleNewScore(score: number, date: number) {

        const queryResult = (await GameResultService.getScoreAvgAndDistribution());
        const averageScore = queryResult.avg ?? score;
        const category = getDistributionKey(score, averageScore);
        const distribution = {
            green: queryResult.green,
            yellow: queryResult.yellow,
            red: queryResult.red
        }
        distribution[category]++; // increase distribution with the new score
        await GameResultService.createGameResult(new GameResult({ score, category, datetime: date }));

        //sendCategory

        broadcastJSON({
            type: MessageHeader.SCORE,
            score,
            avgScore: averageScore,
            distribution
        });
    }

    async function debug() {
        const ledAction = async function () {
            return new Promise((resolve) => {
                setTimeout(() => {
                    handleNewMessage(`${MessageHeader.LED};${Math.floor(Math.random() * 3)}}`, Date.now());
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
        while (true) {
            await ledAction();
            await scoreAction();
        }
    };

    //debug();
})();







