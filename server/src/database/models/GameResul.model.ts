export enum DistributionKey {
    RED = 'red',
    YELLOW = 'yellow',
    GREEN = 'green'
}

export interface IGameResult {
    score: number;
    category: DistributionKey;
    datetime: number;
}

export class GameResult implements IGameResult {
    score: number;
    category: DistributionKey;
    datetime: number;

    constructor(object: IGameResult) {
        this.score = object.score;
        this.category = object.category;
        this.datetime = object.datetime;
    }
}