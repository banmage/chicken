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
exports.Obstacle = void 0;
var types_1 = require("../data/types");
var DifficultyManager_1 = require("../managers/DifficultyManager");
var Obstacle = /** @class */ (function (_super) {
    __extends(Obstacle, _super);
    function Obstacle(x, y, speed, direction) {
        var _this = _super.call(this) || this;
        _this.speed = speed;
        _this.direction = direction;
        _this.laneY = y;
        _this.pos(x, y);
        _this.createView();
        return _this;
    }
    Obstacle.prototype.createView = function () {
        this.graphics.clear();
        this.graphics.drawEllipse(types_1.OBSTACLE_WIDTH / 2, types_1.OBSTACLE_HEIGHT / 2, types_1.OBSTACLE_WIDTH / 2, types_1.OBSTACLE_HEIGHT / 2, '#228B22');
        this.graphics.drawCircle(types_1.OBSTACLE_WIDTH / 2, types_1.OBSTACLE_HEIGHT / 3, 8, '#006400');
        this.size(types_1.OBSTACLE_WIDTH, types_1.OBSTACLE_HEIGHT);
    };
    Obstacle.prototype.update = function () {
        var difficulty = DifficultyManager_1.DifficultyManager.getInstance();
        var actualSpeed = this.speed * difficulty.getObstacleSpeedMultiplier();
        this.x += this.direction * actualSpeed;
        if (this.x + types_1.OBSTACLE_WIDTH < 0) {
            this.x = types_1.GAME_WIDTH;
        }
        else if (this.x > types_1.GAME_WIDTH) {
            this.x = -types_1.OBSTACLE_WIDTH;
        }
    };
    Obstacle.prototype.getLaneY = function () {
        return this.laneY;
    };
    Obstacle.prototype.getBounds = function () {
        return {
            x: this.x,
            y: this.y,
            width: types_1.OBSTACLE_WIDTH,
            height: types_1.OBSTACLE_HEIGHT
        };
    };
    Obstacle.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return Obstacle;
}(Laya.Sprite));
exports.Obstacle = Obstacle;
//# sourceMappingURL=Obstacle.js.map