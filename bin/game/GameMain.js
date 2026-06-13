"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMain = void 0;
var types_1 = require("../data/types");
var Chicken_1 = require("./Chicken");
var Boat_1 = require("./Boat");
var Obstacle_1 = require("./Obstacle");
var MenuUI_1 = require("../ui/MenuUI");
var GameUI_1 = require("../ui/GameUI");
var WinPopup_1 = require("../ui/WinPopup");
var LosePopup_1 = require("../ui/LosePopup");
var PausePopup_1 = require("../ui/PausePopup");
var LevelManager_1 = require("../managers/LevelManager");
var DifficultyManager_1 = require("../managers/DifficultyManager");
var StorageHelper_1 = require("../utils/StorageHelper");
var Debug_1 = require("../utils/Debug");
var GameMain = /** @class */ (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        var _this = _super.call(this) || this;
        _this.currentState = types_1.GameState.Menu;
        _this.chicken = null;
        _this.boats = [];
        _this.obstacles = [];
        _this.menuUI = null;
        _this.gameUI = null;
        _this.winPopup = null;
        _this.losePopup = null;
        _this.pausePopup = null;
        _this.stats = _this.createEmptyStats();
        _this.startTime = 0;
        _this.respawnCount = 3;
        _this.isPaused = false;
        _this.keys = new Set();
        _this.size(types_1.GAME_WIDTH, types_1.GAME_HEIGHT);
        _this.setupInput();
        _this.showMenu();
        Laya.timer.frameLoop(1, _this, _this.onFrameUpdate);
        return _this;
    }
    GameMain.prototype.createEmptyStats = function () {
        return {
            elapsedTime: 0,
            deathCount: 0,
            jumpCount: 0,
            successfulJumpCount: 0
        };
    };
    GameMain.prototype.setupInput = function () {
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    };
    GameMain.prototype.onKeyDown = function (e) {
        var key = e.keyCode;
        var keyStr = this.getKeyString(key);
        if (keyStr) {
            this.keys.add(keyStr);
        }
    };
    GameMain.prototype.onKeyUp = function (e) {
        var key = e.keyCode;
        var keyStr = this.getKeyString(key);
        if (keyStr) {
            this.keys.delete(keyStr);
        }
    };
    GameMain.prototype.getKeyString = function (keyCode) {
        switch (keyCode) {
            case 65:
            case 37: return 'LEFT';
            case 68:
            case 39: return 'RIGHT';
            case 87:
            case 38: return 'UP';
            case 83:
            case 40: return 'DOWN';
            case 80: return 'PAUSE';
            default: return null;
        }
    };
    GameMain.prototype.showMenu = function () {
        this.currentState = types_1.GameState.Menu;
        this.clearGame();
        if (!this.menuUI) {
            this.menuUI = new MenuUI_1.MenuUI();
            this.menuUI.on('start', this, this.startGame);
        }
        this.addChild(this.menuUI);
    };
    GameMain.prototype.startGame = function () {
        this.hideMenu();
        this.initLevel(LevelManager_1.LevelManager.getInstance().getCurrentLevel());
    };
    GameMain.prototype.hideMenu = function () {
        if (this.menuUI) {
            this.removeChild(this.menuUI);
        }
    };
    GameMain.prototype.initLevel = function (level) {
        this.currentState = types_1.GameState.Playing;
        this.stats = this.createEmptyStats();
        this.startTime = Laya.Browser.now();
        this.respawnCount = DifficultyManager_1.DifficultyManager.getInstance().getAssistMode() ? 3 : 0;
        this.isPaused = false;
        var levelConfig = LevelManager_1.LevelManager.getInstance().getLevelConfig(level);
        if (!levelConfig) {
            Debug_1.Debug.error('Level config not found:', level);
            return;
        }
        this.createBackground();
        this.createBanks();
        this.createLanes(levelConfig);
        this.createChicken();
        this.createGameUI();
    };
    GameMain.prototype.createBackground = function () {
        this.graphics.drawRect(0, 0, types_1.GAME_WIDTH, types_1.GAME_HEIGHT, '#87CEEB');
    };
    GameMain.prototype.createBanks = function () {
        var bottomBank = new Laya.Sprite();
        bottomBank.graphics.drawRect(0, types_1.BOTTOM_BANK_Y, types_1.GAME_WIDTH, types_1.BANK_HEIGHT, '#8B4513');
        bottomBank.graphics.drawRect(0, types_1.BOTTOM_BANK_Y, types_1.GAME_WIDTH, 5, '#654321');
        this.addChild(bottomBank);
        var topBank = new Laya.Sprite();
        topBank.graphics.drawRect(0, types_1.TOP_BANK_Y, types_1.GAME_WIDTH, types_1.BANK_HEIGHT, '#228B22');
        topBank.graphics.drawRect(0, types_1.BANK_HEIGHT - 5, types_1.GAME_WIDTH, 5, '#006400');
        this.addChild(topBank);
    };
    GameMain.prototype.createLanes = function (config) {
        var difficulty = DifficultyManager_1.DifficultyManager.getInstance();
        var boatLength = config.boatLength * difficulty.getLengthMultiplier();
        for (var laneIndex = 0; laneIndex < config.lanes; laneIndex++) {
            var laneY = 120 + laneIndex * types_1.LANE_GAP;
            var laneBg = new Laya.Sprite();
            laneBg.graphics.drawRect(0, laneY, types_1.GAME_WIDTH, types_1.LANE_HEIGHT, '#1E90FF');
            this.addChild(laneBg);
            for (var i = 0; i < config.boatsPerLane; i++) {
                var x = (types_1.GAME_WIDTH / (config.boatsPerLane + 1)) * (i + 1);
                var direction = (laneIndex + i) % 2 === 0 ? 1 : -1;
                var boat = new Boat_1.Boat(x, laneY + types_1.LANE_HEIGHT / 2 - types_1.BOAT_HEIGHT / 2, boatLength, config.boatSpeed, direction);
                this.boats.push(boat);
                this.addChild(boat);
            }
            if (!difficulty.shouldHideObstacles()) {
                for (var i = 0; i < Math.min(config.obstacles, 3); i++) {
                    var x = 100 + i * 300 + laneIndex * 50;
                    var direction = (laneIndex + i + 1) % 2 === 0 ? 1 : -1;
                    var obstacle = new Obstacle_1.Obstacle(x, laneY + types_1.LANE_HEIGHT / 2 - types_1.OBSTACLE_HEIGHT / 2, config.boatSpeed * 0.8, direction);
                    this.obstacles.push(obstacle);
                    this.addChild(obstacle);
                }
            }
        }
    };
    GameMain.prototype.createChicken = function () {
        this.chicken = new Chicken_1.Chicken();
        this.addChild(this.chicken);
    };
    GameMain.prototype.createGameUI = function () {
        if (!this.gameUI) {
            this.gameUI = new GameUI_1.GameUI();
            this.gameUI.on('pause', this, this.onPause);
        }
        this.gameUI.setLevel(LevelManager_1.LevelManager.getInstance().getCurrentLevel());
        this.addChild(this.gameUI);
    };
    GameMain.prototype.onPause = function () {
        if (this.currentState !== types_1.GameState.Playing)
            return;
        this.currentState = types_1.GameState.Paused;
        this.isPaused = true;
        this.pausePopup = new PausePopup_1.PausePopup();
        this.pausePopup.on('resume', this, this.onResume);
        this.pausePopup.on('menu', this, this.showMenu);
        this.addChild(this.pausePopup);
    };
    GameMain.prototype.onResume = function () {
        if (this.pausePopup) {
            this.removeChild(this.pausePopup);
            this.pausePopup.destroy();
            this.pausePopup = null;
        }
        this.currentState = types_1.GameState.Playing;
        this.isPaused = false;
    };
    GameMain.prototype.onFrameUpdate = function () {
        if (this.isPaused)
            return;
        switch (this.currentState) {
            case types_1.GameState.Playing:
                this.updateGame();
                break;
        }
    };
    GameMain.prototype.updateGame = function () {
        this.updateStats();
        this.handleInput();
        this.updateBoats();
        this.updateObstacles();
        if (this.chicken) {
            this.chicken.update(16);
            this.checkWin();
            this.checkLose();
        }
    };
    GameMain.prototype.updateStats = function () {
        this.stats.elapsedTime = Laya.Browser.now() - this.startTime;
        if (this.gameUI) {
            this.gameUI.updateStats(this.stats);
        }
    };
    GameMain.prototype.handleInput = function () {
        if (!this.chicken || this.chicken.isJumpingState()) {
            if (this.keys.has('LEFT') || this.keys.has('RIGHT')) {
                return;
            }
        }
        if (this.keys.has('LEFT') && this.chicken) {
            this.chicken.moveLeft();
        }
        if (this.keys.has('RIGHT') && this.chicken) {
            this.chicken.moveRight();
        }
        if (this.keys.has('UP')) {
            this.handleJump(-1);
            this.keys.delete('UP');
        }
        if (this.keys.has('DOWN')) {
            this.handleJump(1);
            this.keys.delete('DOWN');
        }
        if (this.keys.has('PAUSE')) {
            this.onPause();
            this.keys.delete('PAUSE');
        }
    };
    GameMain.prototype.handleJump = function (direction) {
        if (!this.chicken || this.chicken.isJumpingState()) {
            DifficultyManager_1.DifficultyManager.getInstance().recordJump(false);
            return;
        }
        var currentY = this.chicken.y;
        var targetY = currentY + direction * types_1.LANE_GAP;
        if (direction === -1 && targetY < types_1.TOP_BANK_Y + types_1.BANK_HEIGHT) {
            targetY = types_1.TOP_BANK_Y + types_1.BANK_HEIGHT - types_1.CHICKEN_HEIGHT;
        }
        else if (direction === 1 && targetY > types_1.BOTTOM_BANK_Y - types_1.CHICKEN_HEIGHT) {
            targetY = types_1.BOTTOM_BANK_Y - types_1.CHICKEN_HEIGHT;
        }
        var targetBoat = this.findBoatAtPosition(this.chicken.getCenterX(), targetY);
        if (targetBoat) {
            this.chicken.jump(targetY, targetBoat);
            this.stats.jumpCount++;
            DifficultyManager_1.DifficultyManager.getInstance().recordJump(true);
            this.stats.successfulJumpCount++;
        }
        else if (direction === -1 && targetY <= types_1.TOP_BANK_Y + types_1.BANK_HEIGHT) {
            this.chicken.jump(targetY, null);
            this.stats.jumpCount++;
            DifficultyManager_1.DifficultyManager.getInstance().recordJump(true);
            this.stats.successfulJumpCount++;
        }
        else {
            DifficultyManager_1.DifficultyManager.getInstance().recordJump(false);
        }
    };
    GameMain.prototype.findBoatAtPosition = function (x, targetY) {
        var closestBoat = null;
        var minDistance = Infinity;
        for (var _i = 0, _a = this.boats; _i < _a.length; _i++) {
            var boat = _a[_i];
            var boatTop = boat.y;
            var boatBottom = boat.y + types_1.BOAT_HEIGHT;
            if (targetY >= boatTop - types_1.CHICKEN_HEIGHT && targetY <= boatBottom) {
                if (boat.containsPoint(x)) {
                    var distance = Math.abs(x - boat.getCenterX());
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestBoat = boat;
                    }
                }
            }
        }
        return closestBoat;
    };
    GameMain.prototype.updateBoats = function () {
        for (var _i = 0, _a = this.boats; _i < _a.length; _i++) {
            var boat = _a[_i];
            boat.update();
        }
    };
    GameMain.prototype.updateObstacles = function () {
        for (var _i = 0, _a = this.obstacles; _i < _a.length; _i++) {
            var obstacle = _a[_i];
            obstacle.update();
        }
    };
    GameMain.prototype.checkWin = function () {
        if (!this.chicken)
            return;
        if (!this.chicken.isJumpingState() && this.chicken.isOnTopBank()) {
            this.onWin();
        }
    };
    GameMain.prototype.checkLose = function () {
        if (!this.chicken)
            return;
        if (this.chicken.checkObstacleCollision(this.obstacles)) {
            this.onLose();
            return;
        }
        if (!this.chicken.isJumpingState() && !this.chicken.isOnBoatState() && !this.chicken.isOnBankState()) {
            this.onLose();
        }
    };
    GameMain.prototype.onWin = function () {
        this.currentState = types_1.GameState.Win;
        var level = LevelManager_1.LevelManager.getInstance().getCurrentLevel();
        StorageHelper_1.StorageHelper.setHighestLevel(level);
        var stars = 1;
        if (this.stats.elapsedTime < 45000)
            stars = 2;
        if (this.stats.elapsedTime < 30000 && this.stats.deathCount === 0)
            stars = 3;
        StorageHelper_1.StorageHelper.setStars(level, stars);
        this.winPopup = new WinPopup_1.WinPopup();
        this.winPopup.setStars(stars);
        this.winPopup.setTime(this.stats.elapsedTime);
        this.winPopup.setNextLevelEnabled(LevelManager_1.LevelManager.getInstance().hasNextLevel());
        this.winPopup.on('next', this, this.onNextLevel);
        this.winPopup.on('retry', this, this.onRetry);
        this.winPopup.on('menu', this, this.showMenu);
        this.addChild(this.winPopup);
    };
    GameMain.prototype.onLose = function () {
        this.currentState = types_1.GameState.Lose;
        this.stats.deathCount++;
        this.losePopup = new LosePopup_1.LosePopup();
        this.losePopup.setRespawnCount(this.respawnCount);
        this.losePopup.on('retry', this, this.onRetry);
        this.losePopup.on('respawn', this, this.onRespawn);
        this.losePopup.on('menu', this, this.showMenu);
        this.addChild(this.losePopup);
    };
    GameMain.prototype.onRespawn = function () {
        if (this.respawnCount <= 0)
            return;
        this.respawnCount--;
        if (this.losePopup) {
            this.removeChild(this.losePopup);
            this.losePopup.destroy();
            this.losePopup = null;
        }
        if (this.chicken) {
            this.chicken.respawnToLastSafe();
        }
        this.currentState = types_1.GameState.Playing;
    };
    GameMain.prototype.onNextLevel = function () {
        var levelManager = LevelManager_1.LevelManager.getInstance();
        levelManager.nextLevel();
        this.onRetry();
    };
    GameMain.prototype.onRetry = function () {
        this.clearPopups();
        this.clearGame();
        this.initLevel(LevelManager_1.LevelManager.getInstance().getCurrentLevel());
    };
    GameMain.prototype.clearPopups = function () {
        if (this.winPopup) {
            this.winPopup.destroy();
            this.winPopup = null;
        }
        if (this.losePopup) {
            this.losePopup.destroy();
            this.losePopup = null;
        }
        if (this.pausePopup) {
            this.pausePopup.destroy();
            this.pausePopup = null;
        }
    };
    GameMain.prototype.clearGame = function () {
        while (this.numChildren > 0) {
            var child = this.getChildAt(0);
            child.destroy();
        }
        this.boats = [];
        this.obstacles = [];
        this.chicken = null;
        this.gameUI = null;
    };
    GameMain.prototype.destroy = function () {
        Laya.stage.offAll(Laya.Event.KEY_DOWN);
        Laya.stage.offAll(Laya.Event.KEY_UP);
        Laya.timer.clearAll(this);
        this.clearGame();
        this.clearPopups();
        if (this.menuUI) {
            this.menuUI.destroy();
        }
        _super.prototype.destroy.call(this);
    };
    return GameMain;
}(Laya.Sprite));
exports.GameMain = GameMain;
//# sourceMappingURL=GameMain.js.map