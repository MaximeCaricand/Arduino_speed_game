"use strict";
exports.__esModule = true;
exports.GameResult = exports.DistributionKey = exports.MessageHeader = exports.medianAvgOffset = void 0;
exports.medianAvgOffset = 100;
var MessageHeader;
(function (MessageHeader) {
    MessageHeader["LED"] = "led";
    MessageHeader["SCORE"] = "score";
})(MessageHeader = exports.MessageHeader || (exports.MessageHeader = {}));
var DistributionKey;
(function (DistributionKey) {
    DistributionKey["RED"] = "red";
    DistributionKey["YELLOW"] = "yellow";
    DistributionKey["GREEN"] = "green";
})(DistributionKey = exports.DistributionKey || (exports.DistributionKey = {}));
var GameResult = /** @class */ (function () {
    function GameResult(object) {
        this.score = object.score;
        this.category = object.category;
        this.datetime = object.datetime;
    }
    return GameResult;
}());
exports.GameResult = GameResult;
