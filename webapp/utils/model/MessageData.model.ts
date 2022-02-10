export type Distribution = {
    red: number;
    yellow: number;
    green: number;
}

export enum MessageHeader {
    LED = 'led',
    SCORE = 'score'
}

export interface IMessageData {
    type: MessageHeader;
    date: number;
}

export interface ILedMessageData extends IMessageData {
    type: MessageHeader.LED;
    curLed: number;
}

export interface IScoreData extends IMessageData {
    type: MessageHeader.SCORE;
    curTime: number;
    avgTime: number;
    distribution: Distribution;
}