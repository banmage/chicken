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
exports.PausePopup = void 0;
var PausePopup = /** @class */ (function (_super) {
    __extends(PausePopup, _super);
    function PausePopup() {
        var _this = _super.call(this) || this;
        _this.createUI();
        return _this;
    }
    PausePopup.prototype.createUI = function () {
        this.graphics.drawRect(0, 0, 1000, 600, 'rgba(0,0,0,0.7)');
        var panel = new Laya.Sprite();
        panel.pos(350, 200);
        panel.graphics.drawRect(0, 0, 300, 200, '#FFF');
        panel.graphics.drawRect(5, 5, 290, 190, '#EEE');
        this.addChild(panel);
        var title = new Laya.Text();
        title.text = '游戏暂停';
        title.fontSize = 32;
        title.color = '#333';
        title.bold = true;
        title.pos(80, 30);
        panel.addChild(title);
        this.resumeButton = new Laya.Button();
        this.resumeButton.label = '继续游戏';
        this.resumeButton.fontSize = 20;
        this.resumeButton.size(180, 40);
        this.resumeButton.pos(60, 100);
        this.resumeButton.on(Laya.Event.CLICK, this, this.onResumeClick);
        panel.addChild(this.resumeButton);
        this.menuButton = new Laya.Button();
        this.menuButton.label = '返回菜单';
        this.menuButton.fontSize = 20;
        this.menuButton.size(180, 40);
        this.menuButton.pos(60, 150);
        this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
        panel.addChild(this.menuButton);
    };
    PausePopup.prototype.onResumeClick = function () {
        this.event('resume');
    };
    PausePopup.prototype.onMenuClick = function () {
        this.event('menu');
    };
    PausePopup.prototype.destroy = function () {
        this.resumeButton.offAll();
        this.menuButton.offAll();
        _super.prototype.destroy.call(this);
    };
    return PausePopup;
}(Laya.Sprite));
exports.PausePopup = PausePopup;
//# sourceMappingURL=PausePopup.js.map