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
exports.MenuUI = void 0;
var StorageHelper_1 = require("../utils/StorageHelper");
var DifficultyManager_1 = require("../managers/DifficultyManager");
var MenuUI = /** @class */ (function (_super) {
    __extends(MenuUI, _super);
    function MenuUI() {
        var _this = _super.call(this) || this;
        _this.createUI();
        return _this;
    }
    MenuUI.prototype.createUI = function () {
        this.graphics.drawRect(0, 0, 1000, 600, '#87CEEB');
        var title = new Laya.Text();
        title.text = '小鸡过河';
        title.fontSize = 48;
        title.color = '#FFD700';
        title.bold = true;
        title.pos(350, 100);
        this.addChild(title);
        var chicken = new Laya.Sprite();
        chicken.pos(480, 180);
        chicken.graphics.drawCircle(20, 20, 20, '#FFD700');
        chicken.graphics.drawCircle(13, 13, 3, '#000');
        chicken.graphics.drawCircle(27, 13, 3, '#000');
        this.addChild(chicken);
        this.startButton = new Laya.Button();
        this.startButton.label = '开始游戏';
        this.startButton.fontSize = 24;
        this.startButton.size(200, 60);
        this.startButton.pos(400, 300);
        this.startButton.on(Laya.Event.CLICK, this, this.onStartClick);
        this.addChild(this.startButton);
        this.assistMode = StorageHelper_1.StorageHelper.getAssistMode();
        this.assistToggle = new Laya.Button();
        this.updateAssistToggle();
        this.assistToggle.size(150, 40);
        this.assistToggle.pos(425, 380);
        this.assistToggle.on(Laya.Event.CLICK, this, this.onAssistToggle);
        this.addChild(this.assistToggle);
        var highestLevel = StorageHelper_1.StorageHelper.getHighestLevel();
        this.levelText = new Laya.Text();
        this.levelText.text = "\u6700\u9AD8\u5173\u5361: ".concat(highestLevel);
        this.levelText.fontSize = 20;
        this.levelText.color = '#333';
        this.levelText.pos(425, 450);
        this.addChild(this.levelText);
    };
    MenuUI.prototype.onStartClick = function () {
        this.event('start');
    };
    MenuUI.prototype.onAssistToggle = function () {
        this.assistMode = !this.assistMode;
        DifficultyManager_1.DifficultyManager.getInstance().setAssistMode(this.assistMode);
        this.updateAssistToggle();
    };
    MenuUI.prototype.updateAssistToggle = function () {
        this.assistToggle.label = this.assistMode ? '辅助模式: 开' : '辅助模式: 关';
        this.assistToggle.skin = this.assistMode ? '' : '';
    };
    MenuUI.prototype.updateHighestLevel = function (level) {
        this.levelText.text = "\u6700\u9AD8\u5173\u5361: ".concat(level);
    };
    MenuUI.prototype.destroy = function () {
        this.startButton.offAll();
        this.assistToggle.offAll();
        _super.prototype.destroy.call(this);
    };
    return MenuUI;
}(Laya.Sprite));
exports.MenuUI = MenuUI;
//# sourceMappingURL=MenuUI.js.map