"use strict";
exports.__esModule = true;
exports.GameResult = exports.DistributionKey = void 0;
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
