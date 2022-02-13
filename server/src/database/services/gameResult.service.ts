import { DistributionKey, IGameResult } from "../models/GameResul.model";
import GameResultModel from "../schemas/gameResult.schema";

export function createGameResult(item: IGameResult) {
    const gameResultModel = new GameResultModel(item);
    return GameResultModel.create(gameResultModel)
}

export async function getScoreAvgAndDistribution(): Promise<{ avg: number, green: number, yellow: number, red: number }> {
    const result = (await GameResultModel.aggregate([
        {
            $facet: {
                avgScore: [
                    { $group: { _id: null, avg: { $avg: '$score' } } }
                ],
                green: [
                    { $match: { category: { $eq: DistributionKey.GREEN } } },
                    { $count: DistributionKey.GREEN }
                ],
                yellow: [
                    { $match: { category: { $eq: DistributionKey.YELLOW } } },
                    { $count: DistributionKey.YELLOW }
                ],
                red: [
                    { $match: { category: { $eq: DistributionKey.RED } } },
                    { $count: DistributionKey.RED }
                ]
            }
        }
    ]))[0];
    return {
        avg: result?.avgScore[0]?.avg ?? 0,
        green: result?.green[0]?.green ?? 0,
        yellow: result?.yellow[0]?.yellow ?? 0,
        red: result?.red[0]?.red ?? 0,
    }
}