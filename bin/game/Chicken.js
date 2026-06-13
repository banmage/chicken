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
exports.Chicken = void 0;
var types_1 = require("../data/types");
var Chicken = /** @class */ (function (_super) {
    __extends(Chicken, _super);
    function Chicken() {
        var _this = _super.call(this) || this;
        _this.isJumping = false;
        _this.isOnBoat = false;
        _this.currentBoat = null;
        _this.lastSafeBoat = null;
        _this.safeStayTimer = 0;
        _this.isOnBank = true;
        _this.pos(types_1.GAME_WIDTH / 2 - types_1.CHICKEN_WIDTH / 2, types_1.GAME_HEIGHT - types_1.CHICKEN_HEIGHT - 20);
        _this.createView();
        return _this;
    }
    Chicken.prototype.createView = function () {
        this.graphics.clear();
        this.graphics.drawCircle(types_1.CHICKEN_WIDTH / 2, types_1.CHICKEN_HEIGHT / 2, types_1.CHICKEN_WIDTH / 2, '#FFD700');
        this.graphics.drawCircle(types_1.CHICKEN_WIDTH / 3, types_1.CHICKEN_HEIGHT / 3, 5, '#000');
        this.graphics.drawCircle(types_1.CHICKEN_WIDTH * 2 / 3, types_1.CHICKEN_HEIGHT / 3, 5, '#000');
        this.graphics.drawArc(types_1.CHICKEN_WIDTH / 2, types_1.CHICKEN_HEIGHT / 2, 8, 0.2, Math.PI - 0.2, false);
        this.graphics.stroke(1, '#000');
        this.size(types_1.CHICKEN_WIDTH, types_1.CHICKEN_HEIGHT);
    };
    Chicken.prototype.moveLeft = function () {
        if (!this.isJumping) {
            var newX = this.x - Chicken.MOVE_SPEED;
            if (this.isOnBoat && this.currentBoat) {
                this.x = Math.max(this.currentBoat.x, newX);
            }
            else {
                this.x = Math.max(0, newX);
            }
        }
    };
    Chicken.prototype.moveRight = function () {
        if (!this.isJumping) {
            var newX = this.x + Chicken.MOVE_SPEED;
            var maxX = types_1.GAME_WIDTH - types_1.CHICKEN_WIDTH;
            if (this.isOnBoat && this.currentBoat) {
                this.x = Math.min(this.currentBoat.getRight() - types_1.CHICKEN_WIDTH, newX);
            }
            else {
                this.x = Math.min(maxX, newX);
            }
        }
    };
    Chicken.prototype.jump = function (targetY, targetBoat) {
        var _this = this;
        if (this.isJumping)
            return;
        this.isJumping = true;
        this.isOnBoat = false;
        this.currentBoat = null;
        var startY = this.y;
        var endY = targetY;
        var duration = types_1.JUMP_DURATION;
        Laya.Tween.to(this, { y: endY }, duration, Laya.Ease.quadInOut, Laya.Handler.create(this, function () {
            _this.isJumping = false;
            _this.currentBoat = targetBoat;
            _this.isOnBoat = targetBoat !== null;
            _this.isOnBank = _this.checkOnBank();
            _this.safeStayTimer = 0;
        }));
    };
    Chicken.prototype.update = function (dt) {
        if (this.isOnBoat && this.currentBoat) {
            this.safeStayTimer += dt;
            if (this.safeStayTimer >= types_1.SAFE_STAY_TIME && this.lastSafeBoat !== this.currentBoat) {
                this.lastSafeBoat = this.currentBoat;
            }
        }
    };
    Chicken.prototype.checkOnBank = function () {
        return this.y >= types_1.BOTTOM_BANK_Y || this.y <= types_1.TOP_BANK_Y + types_1.BANK_HEIGHT;
    };
    Chicken.prototype.isOnTopBank = function () {
        return this.y <= types_1.TOP_BANK_Y + types_1.BANK_HEIGHT;
    };
    Chicken.prototype.getCenterX = function () {
        return this.x + types_1.CHICKEN_WIDTH / 2;
    };
    Chicken.prototype.getCenterY = function () {
        return this.y + types_1.CHICKEN_HEIGHT / 2;
    };
    Chicken.prototype.getBounds = function () {
        return {
            x: this.x,
            y: this.y,
            width: types_1.CHICKEN_WIDTH,
            height: types_1.CHICKEN_HEIGHT
        };
    };
    Chicken.prototype.checkObstacleCollision = function (obstacles) {
        var bounds = this.getBounds();
        for (var _i = 0, obstacles_1 = obstacles; _i < obstacles_1.length; _i++) {
            var obstacle = obstacles_1[_i];
            var obsBounds = obstacle.getBounds();
            if (bounds.x < obsBounds.x + obsBounds.width &&
                bounds.x + bounds.width > obsBounds.x &&
                bounds.y < obsBounds.y + obsBounds.height &&
                bounds.y + bounds.height > obsBounds.y) {
                return true;
            }
        }
        return false;
    };
    Chicken.prototype.respawnToLastSafe = function () {
        if (this.lastSafeBoat) {
            Laya.Tween.clearAll(this);
            this.isJumping = false;
            this.y = this.lastSafeBoat.getLaneY() - types_1.CHICKEN_HEIGHT / 2;
            this.x = this.lastSafeBoat.getCenterX() - types_1.CHICKEN_WIDTH / 2;
            this.currentBoat = this.lastSafeBoat;
            this.isOnBoat = true;
            this.isOnBank = false;
        }
        else {
            this.respawnToStart();
        }
    };
    Chicken.prototype.respawnToStart = function () {
        Laya.Tween.clearAll(this);
        this.isJumping = false;
        this.isOnBoat = false;
        this.currentBoat = null;
        this.lastSafeBoat = null;
        this.x = types_1.GAME_WIDTH / 2 - types_1.CHICKEN_WIDTH / 2;
        this.y = types_1.GAME_HEIGHT - types_1.CHICKEN_HEIGHT - 20;
        this.isOnBank = true;
        this.safeStayTimer = 0;
    };
    Chicken.prototype.isJumpingState = function () {
        return this.isJumping;
    };
    Chicken.prototype.isOnBoatState = function () {
        return this.isOnBoat;
    };
    Chicken.prototype.isOnBankState = function () {
        return this.isOnBank;
    };
    Chicken.prototype.getCurrentBoat = function () {
        return this.currentBoat;
    };
    Chicken.prototype.destroy = function () {
        Laya.Tween.clearAll(this);
        _super.prototype.destroy.call(this);
    };
    Chicken.MOVE_SPEED = 5;
    return Chicken;
}(Laya.Sprite));
exports.Chicken = Chicken;
//# sourceMappingURL=Chicken.js.map