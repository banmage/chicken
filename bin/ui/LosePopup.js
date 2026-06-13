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
exports.LosePopup = void 0;
var DifficultyManager_1 = require("../managers/DifficultyManager");
var LosePopup = /** @class */ (function (_super) {
    __extends(LosePopup, _super);
    function LosePopup() {
        var _this = _super.call(this) || this;
        _this.hasRespawn = DifficultyManager_1.DifficultyManager.getInstance().getAssistMode();
        _this.createUI();
        return _this;
    }
    LosePopup.prototype.createUI = function () {
        this.graphics.drawRect(0, 0, 1000, 600, 'rgba(0,0,0,0.7)');
        var panel = new Laya.Sprite();
        panel.pos(300, 200);
        panel.graphics.drawRect(0, 0, 400, 200, '#FFF');
        panel.graphics.drawRect(5, 5, 390, 190, '#EEE');
        this.addChild(panel);
        var title = new Laya.Text();
        title.text = '游戏结束';
        title.fontSize = 36;
        title.color = '#FF4444';
        title.bold = true;
        title.pos(120, 30);
        panel.addChild(title);
        this.retryButton = new Laya.Button();
        this.retryButton.label = '重新开始';
        this.retryButton.fontSize = 20;
        this.retryButton.size(150, 40);
        this.retryButton.pos(125, 100);
        this.retryButton.on(Laya.Event.CLICK, this, this.onRetryClick);
        panel.addChild(this.retryButton);
        if (this.hasRespawn) {
            this.respawnButton = new Laya.Button();
            this.respawnButton.label = '复活';
            this.respawnButton.fontSize = 20;
            this.respawnButton.size(150, 40);
            this.respawnButton.pos(125, 150);
            this.respawnButton.on(Laya.Event.CLICK, this, this.onRespawnClick);
            panel.addChild(this.respawnButton);
        }
        this.menuButton = new Laya.Button();
        this.menuButton.label = '菜单';
        this.menuButton.fontSize = 16;
        this.menuButton.size(80, 30);
        this.menuButton.pos(280, 100);
        this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
        panel.addChild(this.menuButton);
    };
    LosePopup.prototype.setRespawnCount = function (count) {
        if (this.respawnButton) {
            this.respawnButton.enabled = count > 0;
            this.respawnButton.label = "\u590D\u6D3B (".concat(count, ")");
        }
    };
    LosePopup.prototype.onRetryClick = function () {
        this.event('retry');
    };
    LosePopup.prototype.onRespawnClick = function () {
        this.event('respawn');
    };
    LosePopup.prototype.onMenuClick = function () {
        this.event('menu');
    };
    LosePopup.prototype.destroy = function () {
        this.retryButton.offAll();
        if (this.respawnButton) {
            this.respawnButton.offAll();
        }
        this.menuButton.offAll();
        _super.prototype.destroy.call(this);
    };
    return LosePopup;
}(Laya.Sprite));
exports.LosePopup = LosePopup;
//# sourceMappingURL=LosePopup.js.map