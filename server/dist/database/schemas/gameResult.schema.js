"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var GameResul_model_1 = require("../models/GameResul.model");
var GameResultModel = (0, mongoose_1.model)('GameResult', new mongoose_1.Schema({
    score: { type: Number, required: true },
    category: { type: String, "enum": GameResul_model_1.DistributionKey, required: true },
    datetime: { type: Number, required: true }
}));
exports["default"] = GameResultModel;
