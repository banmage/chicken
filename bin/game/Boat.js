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
exports.Boat = void 0;
var types_1 = require("../data/types");
var DifficultyManager_1 = require("../managers/DifficultyManager");
var Boat = /** @class */ (function (_super) {
    __extends(Boat, _super);
    function Boat(x, y, width, speed, direction) {
        var _this = _super.call(this) || this;
        _this.width = width;
        _this.speed = speed;
        _this.direction = direction;
        _this.laneY = y;
        _this.pos(x, y);
        _this.createView();
        return _this;
    }
    Boat.prototype.createView = function () {
        this.graphics.clear();
        this.graphics.drawRect(0, 0, this.width, types_1.BOAT_HEIGHT, '#8B4513');
        this.graphics.drawRect(5, 5, this.width - 10, types_1.BOAT_HEIGHT - 10, '#A0522D');
        this.size(this.width, types_1.BOAT_HEIGHT);
    };
    Boat.prototype.update = function () {
        var difficulty = DifficultyManager_1.DifficultyManager.getInstance();
        var actualSpeed = this.speed * difficulty.getSpeedMultiplier();
        this.x += this.direction * actualSpeed;
        if (this.x + this.width < 0) {
            this.x = types_1.GAME_WIDTH;
        }
        else if (this.x > types_1.GAME_WIDTH) {
            this.x = -this.width;
        }
    };
    Boat.prototype.getRight = function () {
        return this.x + this.width;
    };
    Boat.prototype.getCenterX = function () {
        return this.x + this.width / 2;
    };
    Boat.prototype.getLaneY = function () {
        return this.laneY;
    };
    Boat.prototype.getWidth = function () {
        return this.width;
    };
    Boat.prototype.setWidth = function (width) {
        this.width = width;
        this.createView();
    };
    Boat.prototype.containsPoint = function (x) {
        return x >= this.x && x <= this.x + this.width;
    };
    Boat.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    return Boat;
}(Laya.Sprite));
exports.Boat = Boat;
//# sourceMappingURL=Boat.js.map