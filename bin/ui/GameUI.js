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
exports.GameUI = void 0;
var GameUI = /** @class */ (function (_super) {
    __extends(GameUI, _super);
    function GameUI() {
        var _this = _super.call(this) || this;
        _this.createUI();
        return _this;
    }
    GameUI.prototype.createUI = function () {
        this.levelText = new Laya.Text();
        this.levelText.text = '关卡: 1';
        this.levelText.fontSize = 20;
        this.levelText.color = '#FFF';
        this.levelText.pos(20, 20);
        this.levelText.stroke = 2;
        this.levelText.strokeColor = '#000';
        this.addChild(this.levelText);
        this.timeText = new Laya.Text();
        this.timeText.text = '时间: 0:00';
        this.timeText.fontSize = 20;
        this.timeText.color = '#FFF';
        this.timeText.pos(120, 20);
        this.timeText.stroke = 2;
        this.timeText.strokeColor = '#000';
        this.addChild(this.timeText);
        this.deathText = new Laya.Text();
        this.deathText.text = '死亡: 0';
        this.deathText.fontSize = 20;
        this.deathText.color = '#FF4444';
        this.deathText.pos(220, 20);
        this.deathText.stroke = 2;
        this.deathText.strokeColor = '#000';
        this.addChild(this.deathText);
        this.pauseButton = new Laya.Button();
        this.pauseButton.label = '暂停';
        this.pauseButton.fontSize = 16;
        this.pauseButton.size(80, 30);
        this.pauseButton.pos(900, 20);
        this.pauseButton.on(Laya.Event.CLICK, this, this.onPauseClick);
        this.addChild(this.pauseButton);
    };
    GameUI.prototype.updateStats = function (stats) {
        var minutes = Math.floor(stats.elapsedTime / 60000);
        var seconds = Math.floor((stats.elapsedTime % 60000) / 1000);
        this.timeText.text = "\u65F6\u95F4: ".concat(minutes, ":").concat(seconds.toString().padStart(2, '0'));
        this.deathText.text = "\u6B7B\u4EA1: ".concat(stats.deathCount);
    };
    GameUI.prototype.setLevel = function (level) {
        this.levelText.text = "\u5173\u5361: ".concat(level);
    };
    GameUI.prototype.onPauseClick = function () {
        this.event('pause');
    };
    GameUI.prototype.destroy = function () {
        this.pauseButton.offAll();
        _super.prototype.destroy.call(this);
    };
    return GameUI;
}(Laya.Sprite));
exports.GameUI = GameUI;
//# sourceMappingURL=GameUI.js.map