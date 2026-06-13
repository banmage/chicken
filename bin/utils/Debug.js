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
exports.Debug = void 0;
var Debug = /** @class */ (function () {
    function Debug() {
    }
    Debug.setEnabled = function (enabled) {
        this.enabled = enabled;
    };
    Debug.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.enabled) {
            console.log.apply(console, __spreadArray(['[DEBUG]'], args, false));
        }
    };
    Debug.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.enabled) {
            console.warn.apply(console, __spreadArray(['[DEBUG]'], args, false));
        }
    };
    Debug.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.error.apply(console, __spreadArray(['[DEBUG]'], args, false));
    };
    Debug.assert = function (condition, message) {
        if (!condition) {
            console.error('[ASSERT]', message);
            throw new Error("Assertion failed: ".concat(message));
        }
    };
    Debug.time = function (label) {
        if (this.enabled) {
            console.time(label);
        }
    };
    Debug.timeEnd = function (label) {
        if (this.enabled) {
            console.timeEnd(label);
        }
    };
    Debug.enabled = true;
    return Debug;
}());
exports.Debug = Debug;
//# sourceMappingURL=Debug.js.map