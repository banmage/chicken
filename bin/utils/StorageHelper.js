"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageHelper = void 0;
var types_1 = require("../data/types");
var StorageHelper = /** @class */ (function () {
    function StorageHelper() {
    }
    StorageHelper.getSaveData = function () {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.HIGHEST_LEVEL);
            if (!data) {
                return this.defaultSaveData;
            }
            return JSON.parse(data);
        }
        catch (_a) {
            return this.defaultSaveData;
        }
    };
    StorageHelper.saveData = function (data) {
        try {
            Laya.LocalStorage.setItem(types_1.STORAGE_KEYS.HIGHEST_LEVEL, JSON.stringify(data));
        }
        catch (e) {
            console.error('Failed to save data:', e);
        }
    };
    StorageHelper.getHighestLevel = function () {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.HIGHEST_LEVEL);
            if (!data)
                return 1;
            var saveData = JSON.parse(data);
            return saveData.highestLevel || 1;
        }
        catch (_a) {
            return 1;
        }
    };
    StorageHelper.setHighestLevel = function (level) {
        var data = this.getSaveData();
        if (level > data.highestLevel) {
            data.highestLevel = level;
            this.saveData(data);
        }
    };
    StorageHelper.getStars = function (level) {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.STARS);
            if (!data)
                return 0;
            var stars = JSON.parse(data);
            return stars[level] || 0;
        }
        catch (_a) {
            return 0;
        }
    };
    StorageHelper.setStars = function (level, stars) {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.STARS);
            var starsData = data ? JSON.parse(data) : {};
            if (!starsData[level] || stars > starsData[level]) {
                starsData[level] = stars;
                Laya.LocalStorage.setItem(types_1.STORAGE_KEYS.STARS, JSON.stringify(starsData));
            }
        }
        catch (e) {
            console.error('Failed to save stars:', e);
        }
    };
    StorageHelper.getAssistMode = function () {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.ASSIST_MODE);
            return data === 'true';
        }
        catch (_a) {
            return false;
        }
    };
    StorageHelper.setAssistMode = function (enabled) {
        try {
            Laya.LocalStorage.setItem(types_1.STORAGE_KEYS.ASSIST_MODE, enabled.toString());
        }
        catch (e) {
            console.error('Failed to save assist mode:', e);
        }
    };
    StorageHelper.getDailyBestTime = function (dateStr) {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.DAILY_RECORD);
            if (!data)
                return 0;
            var records = JSON.parse(data);
            return records[dateStr] || 0;
        }
        catch (_a) {
            return 0;
        }
    };
    StorageHelper.setDailyBestTime = function (dateStr, time) {
        try {
            var data = Laya.LocalStorage.getItem(types_1.STORAGE_KEYS.DAILY_RECORD);
            var records = data ? JSON.parse(data) : {};
            if (!records[dateStr] || time < records[dateStr]) {
                records[dateStr] = time;
                Laya.LocalStorage.setItem(types_1.STORAGE_KEYS.DAILY_RECORD, JSON.stringify(records));
            }
        }
        catch (e) {
            console.error('Failed to save daily record:', e);
        }
    };
    StorageHelper.defaultSaveData = {
        highestLevel: 1,
        stars: {},
        achievements: [],
        assistMode: false,
        dailyBestTime: {},
        skins: []
    };
    return StorageHelper;
}());
exports.StorageHelper = StorageHelper;
//# sourceMappingURL=StorageHelper.js.map