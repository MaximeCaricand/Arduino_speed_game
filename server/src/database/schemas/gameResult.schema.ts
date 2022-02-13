import { Schema, model } from 'mongoose';
import { DistributionKey } from '../models/GameResul.model';

const GameResultModel = model('GameResult', new Schema({
    score: { type: Number, required: true },
    category: { type: String, enum: DistributionKey, required: true },
    datetime: { type: Number, required: true }
}));

export default GameResultModel;