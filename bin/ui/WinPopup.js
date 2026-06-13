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
exports.WinPopup = void 0;
var WinPopup = /** @class */ (function (_super) {
    __extends(WinPopup, _super);
    function WinPopup() {
        var _this = _super.call(this) || this;
        _this.stars = [];
        _this.createUI();
        return _this;
    }
    WinPopup.prototype.createUI = function () {
        this.graphics.drawRect(0, 0, 1000, 600, 'rgba(0,0,0,0.7)');
        var panel = new Laya.Sprite();
        panel.pos(300, 150);
        panel.graphics.drawRect(0, 0, 400, 300, '#FFF');
        panel.graphics.drawRect(5, 5, 390, 290, '#EEE');
        this.addChild(panel);
        var title = new Laya.Text();
        title.text = '胜利!';
        title.fontSize = 36;
        title.color = '#FFD700';
        title.bold = true;
        title.pos(150, 30);
        panel.addChild(title);
        for (var i = 0; i < 3; i++) {
            var star = new Laya.Sprite();
            star.pos(100 + i * 80, 100);
            star.graphics.drawPoly(20, 20, [20, 0, 24, 15, 40, 15, 28, 25, 33, 40, 20, 30, 7, 40, 12, 25, 0, 15, 16, 15], '#DDD');
            this.stars.push(star);
            panel.addChild(star);
        }
        this.timeText = new Laya.Text();
        this.timeText.text = '用时: 0:00';
        this.timeText.fontSize = 20;
        this.timeText.color = '#333';
        this.timeText.pos(150, 180);
        panel.addChild(this.timeText);
        this.nextButton = new Laya.Button();
        this.nextButton.label = '下一关';
        this.nextButton.fontSize = 20;
        this.nextButton.size(120, 40);
        this.nextButton.pos(140, 230);
        this.nextButton.on(Laya.Event.CLICK, this, this.onNextClick);
        panel.addChild(this.nextButton);
        this.retryButton = new Laya.Button();
        this.retryButton.label = '重试';
        this.retryButton.fontSize = 20;
        this.retryButton.size(120, 40);
        this.retryButton.pos(260, 230);
        this.retryButton.on(Laya.Event.CLICK, this, this.onRetryClick);
        panel.addChild(this.retryButton);
        this.menuButton = new Laya.Button();
        this.menuButton.label = '菜单';
        this.menuButton.fontSize = 16;
        this.menuButton.size(80, 30);
        this.menuButton.pos(160, 280);
        this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
        panel.addChild(this.menuButton);
    };
    WinPopup.prototype.setStars = function (count) {
        for (var i = 0; i < 3; i++) {
            this.stars[i].graphics.clear();
            var color = i < count ? '#FFD700' : '#DDD';
            this.stars[i].graphics.drawPoly(20, 20, [20, 0, 24, 15, 40, 15, 28, 25, 33, 40, 20, 30, 7, 40, 12, 25, 0, 15, 16, 15], color);
        }
    };
    WinPopup.prototype.setTime = function (time) {
        var minutes = Math.floor(time / 60000);
        var seconds = Math.floor((time % 60000) / 1000);
        this.timeText.text = "\u7528\u65F6: ".concat(minutes, ":").concat(seconds.toString().padStart(2, '0'));
    };
    WinPopup.prototype.setNextLevelEnabled = function (enabled) {
        this.nextButton.enabled = enabled;
    };
    WinPopup.prototype.onNextClick = function () {
        this.event('next');
    };
    WinPopup.prototype.onRetryClick = function () {
        this.event('retry');
    };
    WinPopup.prototype.onMenuClick = function () {
        this.event('menu');
    };
    WinPopup.prototype.destroy = function () {
        this.nextButton.offAll();
        this.retryButton.offAll();
        this.menuButton.offAll();
        _super.prototype.destroy.call(this);
    };
    return WinPopup;
}(Laya.Sprite));
exports.WinPopup = WinPopup;
//# sourceMappingURL=WinPopup.js.map