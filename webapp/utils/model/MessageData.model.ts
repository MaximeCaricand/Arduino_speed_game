export enum DistributionKey {
    RED = 'red',
    YELLOW = 'yellow',
    GREEN = 'green'
}

export const medianAvgOffset = 100;

export enum MessageHeader {
    LED = 'led',
    SCORE = 'score',
    STOP = 'stop',
}

export type Distribution = { [key in DistributionKey]: number }

export interface IMessageData {
    type: MessageHeader;
}

export interface ILedMessageData extends IMessageData {
    type: MessageHeader.LED;
    curLed: number;
}

export interface IScoreData extends IMessageData {
    type: MessageHeader.SCORE;
    score: number;
    avgScore: number;
    distribution: Distribution;
}

export interface IStopMessage extends IMessageData {
    type: MessageHeader.STOP;
}

export type Message = IScoreData | ILedMessageData | IStopMessage;