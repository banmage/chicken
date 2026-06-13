"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_KEYS = exports.STORAGE_PREFIX = exports.SAFE_STAY_TIME = exports.JUMP_DURATION = exports.OBSTACLE_HEIGHT = exports.OBSTACLE_WIDTH = exports.BOAT_HEIGHT = exports.CHICKEN_HEIGHT = exports.CHICKEN_WIDTH = exports.LANE_GAP = exports.LANE_HEIGHT = exports.BANK_HEIGHT = exports.TOP_BANK_Y = exports.BOTTOM_BANK_Y = exports.GAME_HEIGHT = exports.GAME_WIDTH = exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState["Menu"] = "Menu";
    GameState["Loading"] = "Loading";
    GameState["Playing"] = "Playing";
    GameState["Paused"] = "Paused";
    GameState["Win"] = "Win";
    GameState["Lose"] = "Lose";
})(GameState || (exports.GameState = GameState = {}));
exports.GAME_WIDTH = 1000;
exports.GAME_HEIGHT = 600;
exports.BOTTOM_BANK_Y = 520;
exports.TOP_BANK_Y = 0;
exports.BANK_HEIGHT = 80;
exports.LANE_HEIGHT = 40;
exports.LANE_GAP = 70;
exports.CHICKEN_WIDTH = 40;
exports.CHICKEN_HEIGHT = 40;
exports.BOAT_HEIGHT = 20;
exports.OBSTACLE_WIDTH = 40;
exports.OBSTACLE_HEIGHT = 30;
exports.JUMP_DURATION = 300;
exports.SAFE_STAY_TIME = 500;
exports.STORAGE_PREFIX = "CCR_";
exports.STORAGE_KEYS = {
    HIGHEST_LEVEL: "".concat(exports.STORAGE_PREFIX, "HIGHEST_LEVEL"),
    STARS: "".concat(exports.STORAGE_PREFIX, "STARS"),
    ACHIEVEMENTS: "".concat(exports.STORAGE_PREFIX, "ACHIEVEMENTS"),
    ASSIST_MODE: "".concat(exports.STORAGE_PREFIX, "ASSIST_MODE"),
    DAILY_RECORD: "".concat(exports.STORAGE_PREFIX, "DAILY_RECORD"),
    SKINS: "".concat(exports.STORAGE_PREFIX, "SKINS")
};
//# sourceMappingURL=types.js.map