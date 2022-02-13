import { DistributionKey } from "./GameResul.model";

export const medianAvgOffset = 100;

export enum MessageHeader {
    LED = 'led',
    SCORE = 'score'
}

export type Distribution = { [key in DistributionKey]: number }

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

