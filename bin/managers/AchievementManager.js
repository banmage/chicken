"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementManager = exports.AchievementType = void 0;
var AchievementType;
(function (AchievementType) {
    AchievementType["FIRST_WIN"] = "FIRST_WIN";
    AchievementType["PERFECT_WIN"] = "PERFECT_WIN";
    AchievementType["FAST_WIN"] = "FAST_WIN";
    AchievementType["NO_DEATH"] = "NO_DEATH";
    AchievementType["LEVEL_5"] = "LEVEL_5";
    AchievementType["LEVEL_10"] = "LEVEL_10";
    AchievementType["DAILY_CHALLENGE"] = "DAILY_CHALLENGE";
})(AchievementType || (exports.AchievementType = AchievementType = {}));
var AchievementManager = /** @class */ (function () {
    function AchievementManager() {
        this.achievements = [
            { id: AchievementType.FIRST_WIN, name: '初次胜利', description: '完成第一关', unlocked: false },
            { id: AchievementType.PERFECT_WIN, name: '完美通关', description: '获得三星评价', unlocked: false },
            { id: AchievementType.FAST_WIN, name: '极速通关', description: '30秒内通关', unlocked: false },
            { id: AchievementType.NO_DEATH, name: '零死亡', description: '一局内零死亡通关', unlocked: false },
            { id: AchievementType.LEVEL_5, name: '第五关', description: '通过第五关', unlocked: false },
            { id: AchievementType.LEVEL_10, name: '最终挑战', description: '通过第十关', unlocked: false },
            { id: AchievementType.DAILY_CHALLENGE, name: '每日挑战', description: '完成每日挑战', unlocked: false }
        ];
        this.loadUnlocked();
    }
    AchievementManager.getInstance = function () {
        if (!AchievementManager.instance) {
            AchievementManager.instance = new AchievementManager();
        }
        return AchievementManager.instance;
    };
    AchievementManager.prototype.loadUnlocked = function () {
        try {
            var data = Laya.LocalStorage.getItem('CCR_ACHIEVEMENTS');
            if (data) {
                var unlocked_1 = JSON.parse(data);
                this.achievements.forEach(function (ach) {
                    ach.unlocked = unlocked_1.includes(ach.id);
                });
            }
        }
        catch (_a) {
            // ignore
        }
    };
    AchievementManager.prototype.saveUnlocked = function () {
        var unlocked = this.achievements.filter(function (ach) { return ach.unlocked; }).map(function (ach) { return ach.id; });
        Laya.LocalStorage.setItem('CCR_ACHIEVEMENTS', JSON.stringify(unlocked));
    };
    AchievementManager.prototype.unlock = function (id) {
        var achievement = this.achievements.find(function (ach) { return ach.id === id; });
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.saveUnlocked();
            return true;
        }
        return false;
    };
    AchievementManager.prototype.isUnlocked = function (id) {
        var achievement = this.achievements.find(function (ach) { return ach.id === id; });
        return achievement ? achievement.unlocked : false;
    };
    AchievementManager.prototype.getAllAchievements = function () {
        return __spreadArray([], this.achievements, true);
    };
    AchievementManager.prototype.getUnlockedCount = function () {
        return this.achievements.filter(function (ach) { return ach.unlocked; }).length;
    };
    return AchievementManager;
}());
exports.AchievementManager = AchievementManager;
//# sourceMappingURL=AchievementManager.js.map