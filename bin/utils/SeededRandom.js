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
exports.SeededRandom = void 0;
var SeededRandom = /** @class */ (function () {
    function SeededRandom(seed) {
        if (typeof seed === 'string') {
            this.seed = this.stringToSeed(seed);
        }
        else {
            this.seed = seed;
        }
    }
    SeededRandom.prototype.stringToSeed = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    SeededRandom.prototype.next = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    };
    SeededRandom.prototype.nextInt = function (min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    };
    SeededRandom.prototype.nextFloat = function (min, max) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        return this.next() * (max - min) + min;
    };
    SeededRandom.prototype.shuffle = function (array) {
        var _a;
        var result = __spreadArray([], array, true);
        for (var i = result.length - 1; i > 0; i--) {
            var j = this.nextInt(0, i);
            _a = [result[j], result[i]], result[i] = _a[0], result[j] = _a[1];
        }
        return result;
    };
    SeededRandom.createDailySeed = function () {
        var dateStr = new Date().toDateString();
        return new SeededRandom(dateStr);
    };
    return SeededRandom;
}());
exports.SeededRandom = SeededRandom;
//# sourceMappingURL=SeededRandom.js.map