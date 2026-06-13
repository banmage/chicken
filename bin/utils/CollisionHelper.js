"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionHelper = void 0;
var CollisionHelper = /** @class */ (function () {
    function CollisionHelper() {
    }
    CollisionHelper.rectIntersect = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    };
    CollisionHelper.pointInRect = function (px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    };
    CollisionHelper.pointInRange = function (px, min, max) {
        return px >= min && px <= max;
    };
    CollisionHelper.closestPointOnLine = function (px, py, x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
        return {
            x: x1 + t * dx,
            y: y1 + t * dy
        };
    };
    CollisionHelper.distance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    };
    return CollisionHelper;
}());
exports.CollisionHelper = CollisionHelper;
//# sourceMappingURL=CollisionHelper.js.map