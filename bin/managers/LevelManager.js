"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelManager = void 0;
var Debug_1 = require("../utils/Debug");
var LevelManager = /** @class */ (function () {
    function LevelManager() {
        this.levels = [];
        this.currentLevel = 1;
    }
    LevelManager.getInstance = function () {
        if (!LevelManager.instance) {
            LevelManager.instance = new LevelManager();
        }
        return LevelManager.instance;
    };
    LevelManager.prototype.loadLevels = function (data) {
        this.levels = data.levels;
        Debug_1.Debug.log('Levels loaded:', this.levels.length);
    };
    LevelManager.prototype.getLevelConfig = function (levelId) {
        return this.levels.find(function (l) { return l.id === levelId; }) || null;
    };
    LevelManager.prototype.getCurrentLevelConfig = function () {
        return this.getLevelConfig(this.currentLevel);
    };
    LevelManager.prototype.setCurrentLevel = function (level) {
        this.currentLevel = level;
    };
    LevelManager.prototype.getCurrentLevel = function () {
        return this.currentLevel;
    };
    LevelManager.prototype.getTotalLevels = function () {
        return this.levels.length;
    };
    LevelManager.prototype.hasNextLevel = function () {
        return this.currentLevel < this.levels.length;
    };
    LevelManager.prototype.nextLevel = function () {
        if (this.hasNextLevel()) {
            this.currentLevel++;
        }
    };
    LevelManager.prototype.reset = function () {
        this.currentLevel = 1;
    };
    return LevelManager;
}());
exports.LevelManager = LevelManager;
//# sourceMappingURL=LevelManager.js.map