"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifficultyManager = void 0;
var StorageHelper_1 = require("../utils/StorageHelper");
var DifficultyManager = /** @class */ (function () {
    function DifficultyManager() {
        this.jumpHistory = [];
        this.speedMultiplier = 1;
        this.lengthMultiplier = 1;
        this.obstacleSpeedMultiplier = 1;
        this.hideObstacles = false;
    }
    DifficultyManager.getInstance = function () {
        if (!DifficultyManager.instance) {
            DifficultyManager.instance = new DifficultyManager();
        }
        return DifficultyManager.instance;
    };
    DifficultyManager.prototype.recordJump = function (success) {
        this.jumpHistory.push(success);
        if (this.jumpHistory.length > 5) {
            this.jumpHistory.shift();
        }
        this.updateDifficulty();
    };
    DifficultyManager.prototype.updateDifficulty = function () {
        if (this.jumpHistory.length < 5)
            return;
        var successRate = this.jumpHistory.filter(Boolean).length / this.jumpHistory.length;
        if (successRate < 0.4) {
            this.decreaseDifficulty();
        }
        else if (successRate > 0.8) {
            this.increaseDifficulty();
        }
    };
    DifficultyManager.prototype.decreaseDifficulty = function () {
        this.speedMultiplier = Math.max(0.5, this.speedMultiplier * 0.85);
        this.lengthMultiplier = Math.min(2, this.lengthMultiplier * 1.1);
        this.hideObstacles = true;
    };
    DifficultyManager.prototype.increaseDifficulty = function () {
        this.speedMultiplier = Math.min(2, this.speedMultiplier * 1.15);
        this.lengthMultiplier = Math.max(0.5, this.lengthMultiplier * 0.95);
        this.obstacleSpeedMultiplier = Math.min(2, this.obstacleSpeedMultiplier * 1.1);
        this.hideObstacles = false;
    };
    DifficultyManager.prototype.getSpeedMultiplier = function () {
        return this.speedMultiplier;
    };
    DifficultyManager.prototype.getLengthMultiplier = function () {
        return this.lengthMultiplier;
    };
    DifficultyManager.prototype.getObstacleSpeedMultiplier = function () {
        return this.obstacleSpeedMultiplier;
    };
    DifficultyManager.prototype.shouldHideObstacles = function () {
        return this.hideObstacles;
    };
    DifficultyManager.prototype.getAssistMode = function () {
        return StorageHelper_1.StorageHelper.getAssistMode();
    };
    DifficultyManager.prototype.setAssistMode = function (enabled) {
        StorageHelper_1.StorageHelper.setAssistMode(enabled);
    };
    DifficultyManager.prototype.reset = function () {
        this.jumpHistory = [];
        this.speedMultiplier = 1;
        this.lengthMultiplier = 1;
        this.obstacleSpeedMultiplier = 1;
        this.hideObstacles = false;
    };
    return DifficultyManager;
}());
exports.DifficultyManager = DifficultyManager;
//# sourceMappingURL=DifficultyManager.js.map