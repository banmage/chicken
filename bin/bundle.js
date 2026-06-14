// LayaAir 3.x 小鸡过河游戏 - 单文件版本
// 所有代码合并到一个文件中，使用全局命名空间
/// <reference path="./laya.d.ts" />
var CCR;
(function (CCR) {
    // ==================== 常量定义 ====================
    CCR.GAME_WIDTH = 1000;
    CCR.GAME_HEIGHT = 600;
    // 场景固定为 8 个等高带：顶部岸 1 条 + 河道 6 条 + 底部岸 1 条
    CCR.TOP_BANK_Y = 0;
    CCR.LANE_GAP = 75;
    CCR.BANK_HEIGHT = CCR.LANE_GAP;
    CCR.RIVER_LANE_COUNT = 6;
    CCR.BOTTOM_BANK_Y = CCR.TOP_BANK_Y + CCR.BANK_HEIGHT + CCR.RIVER_LANE_COUNT * CCR.LANE_GAP;
    // 小鸡设置
    CCR.CHICKEN_WIDTH = 36;
    CCR.CHICKEN_HEIGHT = 36;
    // 船设置（船水平放置，在垂直河道中左右移动）
    CCR.BOAT_WIDTH = 55;
    CCR.BOAT_HEIGHT = 28;
    // 障碍物设置
    CCR.OBSTACLE_WIDTH = 35;
    CCR.OBSTACLE_HEIGHT = 25;
    // 跳跃设置
    CCR.JUMP_DURATION = 280;
    CCR.SAFE_STAY_TIME = 500;
    CCR.STORAGE_PREFIX = "CCR_";
    CCR.STORAGE_KEYS = {
        HIGHEST_LEVEL: `${CCR.STORAGE_PREFIX}HIGHEST_LEVEL`,
        STARS: `${CCR.STORAGE_PREFIX}STARS`,
        ACHIEVEMENTS: `${CCR.STORAGE_PREFIX}ACHIEVEMENTS`,
        ASSIST_MODE: `${CCR.STORAGE_PREFIX}ASSIST_MODE`,
        DAILY_RECORD: `${CCR.STORAGE_PREFIX}DAILY_RECORD`,
        SKINS: `${CCR.STORAGE_PREFIX}SKINS`
    };
    // ==================== 类型定义 ====================
    let GameState;
    (function (GameState) {
        GameState["Menu"] = "Menu";
        GameState["Loading"] = "Loading";
        GameState["Playing"] = "Playing";
        GameState["Paused"] = "Paused";
        GameState["Win"] = "Win";
        GameState["Lose"] = "Lose";
    })(GameState = CCR.GameState || (CCR.GameState = {}));
    // ==================== 关卡数据 ====================
    CCR.LEVELS = [
        { id: 1, lanes: 3, boatsPerLane: 2, boatSpeed: 1.0, boatLength: 150, obstacles: 0 },
        { id: 2, lanes: 4, boatsPerLane: 2, boatSpeed: 1.2, boatLength: 140, obstacles: 1 },
        { id: 3, lanes: 4, boatsPerLane: 2, boatSpeed: 1.5, boatLength: 130, obstacles: 2 },
        { id: 4, lanes: 5, boatsPerLane: 2, boatSpeed: 1.8, boatLength: 120, obstacles: 2 },
        { id: 5, lanes: 5, boatsPerLane: 3, boatSpeed: 2.0, boatLength: 115, obstacles: 3 },
        { id: 6, lanes: 5, boatsPerLane: 3, boatSpeed: 2.2, boatLength: 110, obstacles: 3 },
        { id: 7, lanes: 6, boatsPerLane: 3, boatSpeed: 2.5, boatLength: 105, obstacles: 4 },
        { id: 8, lanes: 6, boatsPerLane: 3, boatSpeed: 2.8, boatLength: 100, obstacles: 4 },
        { id: 9, lanes: 6, boatsPerLane: 4, boatSpeed: 3.0, boatLength: 95, obstacles: 5 },
        { id: 10, lanes: 7, boatsPerLane: 4, boatSpeed: 3.2, boatLength: 90, obstacles: 5 }
    ];
    // ==================== 工具类 ====================
    class SeededRandom {
        constructor(seed) {
            if (typeof seed === 'string') {
                this.seed = this.stringToSeed(seed);
            }
            else {
                this.seed = seed;
            }
        }
        stringToSeed(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        }
        next() {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            return this.seed / 233280;
        }
        nextInt(min, max) {
            return Math.floor(this.next() * (max - min + 1)) + min;
        }
    }
    CCR.SeededRandom = SeededRandom;
    class Debug {
        static log(...args) {
        }
        static error(...args) {
            console.error('[CCR]', ...args);
        }
    }
    CCR.Debug = Debug;
    class StorageHelper {
        static getHighestLevel() {
            try {
                const data = Laya.LocalStorage.getItem(CCR.STORAGE_KEYS.HIGHEST_LEVEL);
                return data ? parseInt(data) : 1;
            }
            catch (_a) {
                return 1;
            }
        }
        static setHighestLevel(level) {
            Laya.LocalStorage.setItem(CCR.STORAGE_KEYS.HIGHEST_LEVEL, level.toString());
        }
        static getStars(level) {
            try {
                const data = Laya.LocalStorage.getItem(CCR.STORAGE_KEYS.STARS);
                if (!data)
                    return 0;
                const stars = JSON.parse(data);
                return stars[level] || 0;
            }
            catch (_a) {
                return 0;
            }
        }
        static setStars(level, stars) {
            try {
                const data = Laya.LocalStorage.getItem(CCR.STORAGE_KEYS.STARS);
                const starsData = data ? JSON.parse(data) : {};
                if (!starsData[level] || stars > starsData[level]) {
                    starsData[level] = stars;
                    Laya.LocalStorage.setItem(CCR.STORAGE_KEYS.STARS, JSON.stringify(starsData));
                }
            }
            catch (e) {
                Debug.error('Failed to save stars:', e);
            }
        }
        static getAssistMode() {
            try {
                const data = Laya.LocalStorage.getItem(CCR.STORAGE_KEYS.ASSIST_MODE);
                return data === 'true';
            }
            catch (_a) {
                return false;
            }
        }
        static setAssistMode(enabled) {
            Laya.LocalStorage.setItem(CCR.STORAGE_KEYS.ASSIST_MODE, enabled.toString());
        }
    }
    CCR.StorageHelper = StorageHelper;
    class DifficultyManager {
        constructor() {
            this.jumpHistory = [];
            this.speedMultiplier = 1;
            this.lengthMultiplier = 1;
            this.hideObstacles = false;
        }
        static getInstance() {
            if (!DifficultyManager.instance) {
                DifficultyManager.instance = new DifficultyManager();
            }
            return DifficultyManager.instance;
        }
        recordJump(success) {
            this.jumpHistory.push(success);
            if (this.jumpHistory.length > 5) {
                this.jumpHistory.shift();
            }
            this.updateDifficulty();
        }
        updateDifficulty() {
            if (this.jumpHistory.length < 5)
                return;
            const successRate = this.jumpHistory.filter(Boolean).length / this.jumpHistory.length;
            if (successRate < 0.4) {
                this.speedMultiplier = Math.max(0.5, this.speedMultiplier * 0.85);
                this.lengthMultiplier = Math.min(2, this.lengthMultiplier * 1.1);
                this.hideObstacles = true;
            }
            else if (successRate > 0.8) {
                this.speedMultiplier = Math.min(2, this.speedMultiplier * 1.15);
                this.lengthMultiplier = Math.max(0.5, this.lengthMultiplier * 0.95);
                this.hideObstacles = false;
            }
        }
        getSpeedMultiplier() { return this.speedMultiplier; }
        getLengthMultiplier() { return this.lengthMultiplier; }
        shouldHideObstacles() { return this.hideObstacles; }
        getAssistMode() { return StorageHelper.getAssistMode(); }
        setAssistMode(enabled) { StorageHelper.setAssistMode(enabled); }
        reset() {
            this.jumpHistory = [];
            this.speedMultiplier = 1;
            this.lengthMultiplier = 1;
            this.hideObstacles = false;
        }
    }
    CCR.DifficultyManager = DifficultyManager;
    class LevelManager {
        constructor() {
            this.currentLevel = 1;
        }
        static getInstance() {
            if (!LevelManager.instance) {
                LevelManager.instance = new LevelManager();
            }
            return LevelManager.instance;
        }
        getLevelConfig(levelId) {
            return CCR.LEVELS.find(l => l.id === levelId) || null;
        }
        getCurrentLevelConfig() {
            return this.getLevelConfig(this.currentLevel);
        }
        setCurrentLevel(level) { this.currentLevel = level; }
        getCurrentLevel() { return this.currentLevel; }
        getTotalLevels() { return CCR.LEVELS.length; }
        hasNextLevel() { return this.currentLevel < CCR.LEVELS.length; }
        nextLevel() { if (this.hasNextLevel())
            this.currentLevel++; }
        reset() { this.currentLevel = 1; }
    }
    CCR.LevelManager = LevelManager;
    // ==================== 游戏实体 ====================
    class Boat extends Laya.Sprite {
        constructor(x, y, width, speed, direction) {
            super();
            this.boatWidth = width;
            this.speed = speed;
            this.direction = direction;
            this.pos(x, y);
            this.createView();
        }
        createView() {
            this.graphics.clear();
            const bambooCount = Math.max(4, Math.floor(this.boatWidth / 18));
            const bambooGap = 1;
            const bambooWidth = (this.boatWidth - bambooGap * (bambooCount - 1)) / bambooCount;
            const raftTop = 2;
            const raftHeight = CCR.BOAT_HEIGHT - 4;
            // 竹筏主体：多根并排竹子
            for (let i = 0; i < bambooCount; i++) {
                const x = i * (bambooWidth + bambooGap);
                const color = i % 2 === 0 ? '#8f6b2f' : '#775523';
                this.graphics.drawEllipse(x + bambooWidth / 2, CCR.BOAT_HEIGHT / 2, bambooWidth / 2, raftHeight / 2, color);
                this.graphics.drawEllipse(x + bambooWidth / 2, CCR.BOAT_HEIGHT / 2 - 1, bambooWidth / 2 - 1, raftHeight / 2 - 3, '#b38743');
            }
            // 横向捆扎绳
            this.graphics.drawRect(10, 5, this.boatWidth - 20, 2, '#7b4b21');
            this.graphics.drawRect(10, CCR.BOAT_HEIGHT - 7, this.boatWidth - 20, 2, '#7b4b21');
            // 绳结和竹节细节
            const knotXs = [14, this.boatWidth / 2 - 2, this.boatWidth - 18];
            for (const knotX of knotXs) {
                this.graphics.drawRect(knotX, 3, 4, 6, '#6a3f1d');
                this.graphics.drawRect(knotX, CCR.BOAT_HEIGHT - 9, 4, 6, '#6a3f1d');
            }
            for (let i = 1; i < bambooCount; i += 2) {
                const jointX = i * (bambooWidth + bambooGap) - bambooGap / 2;
                this.graphics.drawRect(jointX, raftTop + 2, 1.5, raftHeight - 4, '#a97b3d');
            }
            this.size(this.boatWidth, CCR.BOAT_HEIGHT);
        }
        update() {
            const difficulty = DifficultyManager.getInstance();
            const actualSpeed = this.speed * difficulty.getSpeedMultiplier();
            // 船在水平方向移动
            this.x += this.direction * actualSpeed;
            // 边界检测
            if (this.x + this.boatWidth < 0) {
                this.x = CCR.GAME_WIDTH;
            }
            else if (this.x > CCR.GAME_WIDTH) {
                this.x = -this.boatWidth;
            }
        }
        getRight() { return this.x + this.boatWidth; }
        getCenterX() { return this.x + this.boatWidth / 2; }
        getWidth() { return this.boatWidth; }
        getDirection() { return this.direction; }
        getSpeed() { return this.speed; }
        containsPoint(x) { return x >= this.x && x <= this.x + this.boatWidth; }
    }
    CCR.Boat = Boat;
    class Obstacle extends Laya.Sprite {
        constructor(x, y, speed, direction) {
            super();
            this.speed = speed;
            this.direction = direction;
            this.mouthPhase = Math.random() * Math.PI * 2;
            this.pos(x, y);
            this.createView();
        }
        createView() {
            this.size(CCR.OBSTACLE_WIDTH, CCR.OBSTACLE_HEIGHT);
            this.graphics.clear();
            while (this.numChildren > 0) {
                this.removeChild(this.getChildAt(0));
            }
            this.body = new Laya.Sprite();
            this.drawBody(this.body.graphics, this.direction > 0);
            this.addChild(this.body);
            this.upperJaw = new Laya.Sprite();
            this.drawUpperJaw(this.upperJaw.graphics, this.direction > 0);
            this.addChild(this.upperJaw);
            this.lowerJaw = new Laya.Sprite();
            this.drawLowerJaw(this.lowerJaw.graphics, this.direction > 0);
            this.addChild(this.lowerJaw);
            this.updateMouthAnimation();
        }
        drawBody(graphics, facingRight) {
            graphics.clear();
            const mirrorX = (x) => facingRight ? x : CCR.OBSTACLE_WIDTH - x;
            graphics.drawEllipse(20, 17, 16, 10, '#6f9f3f');
            graphics.drawEllipse(23, 19, 11, 4, '#c7d28b');
            if (facingRight) {
                graphics.drawPoly(3, 16, [0, 0, 9, -7, 8, 6], '#5d8532');
            }
            else {
                graphics.drawPoly(37, 16, [0, 0, -9, -7, -8, 6], '#5d8532');
            }
            graphics.drawPoly(mirrorX(22), 7, [0, 3, 3, -2, 6, 3], '#405e22');
            graphics.drawPoly(mirrorX(28), 6, [0, 3, 3, -3, 6, 3], '#405e22');
            graphics.drawPoly(mirrorX(34), 8, [0, 3, 3, -2, 6, 3], '#405e22');
            graphics.drawPoly(mirrorX(18), 22, [0, 0, facingRight ? -3 : 3, 6, facingRight ? 1 : -1, 4, facingRight ? 3 : -3, 0], '#5e8435');
            graphics.drawPoly(mirrorX(30), 21, [0, 0, facingRight ? -3 : 3, 6, facingRight ? 1 : -1, 4, facingRight ? 3 : -3, 0], '#5e8435');
            graphics.drawCircle(mirrorX(12), 20, 1.3, '#507729');
            graphics.drawCircle(mirrorX(25), 11, 1.2, '#507729');
            graphics.drawCircle(mirrorX(31), 13, 1.1, '#507729');
        }
        drawUpperJaw(graphics, facingRight) {
            graphics.clear();
            const mirrorX = (x) => facingRight ? x : 31 - x;
            const jawPoints = [
                0, 7,
                5, 1,
                15, 0,
                26, 2,
                31, 5,
                24, 8,
                8, 9
            ];
            const mirroredPoints = [];
            for (let i = 0; i < jawPoints.length; i += 2) {
                mirroredPoints.push(mirrorX(jawPoints[i]), jawPoints[i + 1]);
            }
            this.upperJaw.pos(facingRight ? 6 : 4, 6);
            graphics.drawPoly(0, 0, mirroredPoints, '#7dc443');
            graphics.drawCircle(mirrorX(10), 1.5, 3.2, '#7dc443');
            graphics.drawCircle(mirrorX(11), 1.6, 1.3, '#1d2910');
            graphics.drawCircle(mirrorX(24), 4.1, 0.8, '#36531a');
            graphics.drawCircle(mirrorX(27), 4.6, 0.8, '#36531a');
            graphics.drawCircle(mirrorX(31), 5.2, 1, '#203014');
        }
        drawLowerJaw(graphics, facingRight) {
            graphics.clear();
            const mirrorX = (x) => facingRight ? x : 30 - x;
            const jawPoints = [
                0, 0,
                8, 5,
                19, 6,
                28, 4,
                30, 2,
                19, 11,
                4, 9
            ];
            const mouthPoints = [
                5, 1,
                11, 5,
                18, 5,
                25, 3,
                19, 8,
                7, 7
            ];
            const mirroredJawPoints = [];
            const mirroredMouthPoints = [];
            for (let i = 0; i < jawPoints.length; i += 2) {
                mirroredJawPoints.push(mirrorX(jawPoints[i]), jawPoints[i + 1]);
            }
            for (let i = 0; i < mouthPoints.length; i += 2) {
                mirroredMouthPoints.push(mirrorX(mouthPoints[i]), mouthPoints[i + 1]);
            }
            this.lowerJaw.pos(facingRight ? 7 : 6, 14);
            graphics.drawPoly(0, 0, mirroredJawPoints, '#f1c986');
            graphics.drawPoly(0, 0, mirroredMouthPoints, '#d04d4a');
            for (let i = 0; i < 4; i++) {
                const toothX = mirrorX(8 + i * 5);
                if (facingRight) {
                    graphics.drawPoly(toothX, 1, [0, 0, 1.5, 3.5, 3, 0], '#fff9ef');
                }
                else {
                    graphics.drawPoly(toothX, 1, [0, 0, -1.5, 3.5, -3, 0], '#fff9ef');
                }
            }
        }
        update() {
            const difficulty = DifficultyManager.getInstance();
            const actualSpeed = this.speed * difficulty.getSpeedMultiplier();
            this.x += this.direction * actualSpeed;
            this.updateMouthAnimation();
            if (this.x + CCR.OBSTACLE_WIDTH < 0) {
                this.x = CCR.GAME_WIDTH;
            }
            else if (this.x > CCR.GAME_WIDTH) {
                this.x = -CCR.OBSTACLE_WIDTH;
            }
        }
        getBounds() {
            return { x: this.x, y: this.y, width: CCR.OBSTACLE_WIDTH, height: CCR.OBSTACLE_HEIGHT };
        }
        updateMouthAnimation() {
            this.mouthPhase += Obstacle.MOUTH_SWING_SPEED;
            const openRatio = (Math.sin(this.mouthPhase) + 1) / 2;
            this.upperJaw.y = 6 - openRatio * 1.5;
            this.lowerJaw.y = 14 + openRatio * Obstacle.MOUTH_OPEN_OFFSET;
        }
    }
    Obstacle.MOUTH_SWING_SPEED = 0.18;
    Obstacle.MOUTH_OPEN_OFFSET = 6;
    CCR.Obstacle = Obstacle;
    class Chicken extends Laya.Sprite {
        constructor() {
            super();
            this.isJumping = false;
            this.isOnBoat = false;
            this.currentBoat = null;
            this.lastSafeBoat = null;
            this.safeStayTimer = 0;
            this.isOnBank = true;
            this.jumpVelocityX = 0;
            this.jumpAirDrag = Chicken.AIR_DRAG;
            this.justLanded = false;
            this.facing = 'right';
            // 确保小鸡初始位置在底部河岸上
            this.pos(CCR.GAME_WIDTH / 2 - CCR.CHICKEN_WIDTH / 2, CCR.BOTTOM_BANK_Y + CCR.BANK_HEIGHT / 2 - CCR.CHICKEN_HEIGHT / 2);
            this.createView();
        }
        createView() {
            this.graphics.clear();
            const facingRight = this.facing === 'right';
            const mirrorX = (x) => facingRight ? x : CCR.CHICKEN_WIDTH - x;
            const mirrorPoints = (points) => {
                const result = [];
                for (let i = 0; i < points.length; i += 2) {
                    result.push(-points[i], points[i + 1]);
                }
                return result;
            };
            // 侧面身体和头
            this.graphics.drawEllipse(mirrorX(16), 23, 11, 10, '#ffe082');
            this.graphics.drawEllipse(mirrorX(24), 15, 9, 9, '#ffd54f');
            this.graphics.drawEllipse(mirrorX(14), 22, 6, 6, '#fff4c2');
            // 翅膀
            this.graphics.drawEllipse(mirrorX(13), 23, 5, 4, '#f6c445');
            this.graphics.drawEllipse(mirrorX(13), 23, 2.5, 2, '#fff0b0');
            // 腮红
            this.graphics.drawCircle(mirrorX(27), 18, 1.8, '#ffb3a7');
            // 嘴巴
            this.graphics.drawPoly(mirrorX(30), 17, facingRight ? [0, 0, 7, 2, 0, 5] : mirrorPoints([0, 0, 7, 2, 0, 5]), '#ff9f43');
            this.graphics.drawPoly(mirrorX(30), 19, facingRight ? [0, 0, 5, 1, 0, 3] : mirrorPoints([0, 0, 5, 1, 0, 3]), '#ff7f2a');
            // 鸡冠
            this.graphics.drawCircle(mirrorX(19), 6.5, 2.4, '#f35b57');
            this.graphics.drawCircle(mirrorX(22.5), 4.8, 2.7, '#f35b57');
            this.graphics.drawCircle(mirrorX(25.2), 6.4, 2.1, '#f35b57');
            // 单眼侧脸和高光
            this.graphics.drawCircle(mirrorX(24.5), 14.5, 2.1, '#2d241c');
            this.graphics.drawCircle(mirrorX(25.1), 13.8, 0.7, '#fff');
            // 小脚
            this.graphics.drawRect(mirrorX(13), 32, 2, 4, '#ff8a65');
            this.graphics.drawRect(mirrorX(19), 32, 2, 4, '#ff8a65');
            this.size(CCR.CHICKEN_WIDTH, CCR.CHICKEN_HEIGHT);
        }
        moveLeft() {
            if (!this.isJumping) {
                this.facing = 'left';
                this.createView();
                const newX = this.x - Chicken.MOVE_SPEED;
                if (this.isOnBoat && this.currentBoat) {
                    this.x = Math.max(this.currentBoat.x, newX);
                }
                else {
                    this.x = Math.max(0, newX);
                }
            }
        }
        moveRight() {
            if (!this.isJumping) {
                this.facing = 'right';
                this.createView();
                const newX = this.x + Chicken.MOVE_SPEED;
                const maxX = CCR.GAME_WIDTH - CCR.CHICKEN_WIDTH;
                if (this.isOnBoat && this.currentBoat) {
                    this.x = Math.min(this.currentBoat.getRight() - CCR.CHICKEN_WIDTH, newX);
                }
                else {
                    this.x = Math.min(maxX, newX);
                }
            }
        }
        jump(targetY, extraVelocityX = 0, arcHeightOverride, inheritFactor = 1, airDragOverride) {
            if (this.isJumping)
                return;
            // 清理之前的跳跃计时器，防止出现多个跳跃动画
            Laya.timer.clearAll(this);
            const launchBoat = this.currentBoat;
            const launchVelocityX = this.isOnBoat && launchBoat
                ? launchBoat.getDirection() * launchBoat.getSpeed() * DifficultyManager.getInstance().getSpeedMultiplier()
                : 0;
            this.isJumping = true;
            this.isOnBoat = false;
            this.isOnBank = false;
            this.currentBoat = null;
            this.lastBoatCenterX = undefined;
            this.justLanded = false;
            const startY = this.y;
            const duration = CCR.JUMP_DURATION;
            const arcHeight = arcHeightOverride !== null && arcHeightOverride !== void 0 ? arcHeightOverride : 50; // 跳跃弧线高度（小鸡向上跳的最大高度）
            // 记录跳跃信息，供物理计算
            this.jumpStartY = startY;
            this.jumpTargetY = targetY;
            this.pendingTargetY = targetY; // 设置落点位置，用于跳跃过程中检测船
            this.jumpStartTime = Laya.Browser.now();
            this.jumpDuration = duration;
            this.jumpArcHeight = arcHeight;
            this.jumpVelocityX = launchVelocityX * inheritFactor + extraVelocityX;
            this.jumpAirDrag = airDragOverride !== null && airDragOverride !== void 0 ? airDragOverride : Chicken.AIR_DRAG;
            // 使用抛物线动画
            const jumpStep = 16; // 约60fps
            const totalSteps = Math.ceil(duration / jumpStep);
            let currentStep = 0;
            const doJumpStep = () => {
                // 检查小鸡是否仍然有效（未被销毁）
                if (!this.isJumping) {
                    return; // 跳跃已被中断，停止动画
                }
                currentStep++;
                const progress = currentStep / totalSteps;
                if (progress < 1) {
                    // 使用抛物线公式计算当前Y位置
                    // y = startY + (targetY - startY) * t + arcHeight * 4 * t * (1 - t)
                    // 这是一个标准的抛物线公式，在t=0.5时达到最高点
                    const t = progress;
                    const linearY = startY + (targetY - startY) * t;
                    const arcOffset = arcHeight * 4 * t * (1 - t);
                    this.y = linearY - arcOffset;
                    this.x += this.jumpVelocityX;
                    this.x = Math.max(-CCR.CHICKEN_WIDTH, Math.min(CCR.GAME_WIDTH, this.x));
                    this.jumpVelocityX *= this.jumpAirDrag;
                    // 继续计时器
                    Laya.timer.once(jumpStep, this, doJumpStep);
                }
                else {
                    // 跳跃结束
                    this.y = targetY;
                    this.isJumping = false;
                    this.jumpStartY = undefined;
                    this.jumpTargetY = undefined;
                    this.pendingTargetY = undefined; // 清除落点位置
                    this.jumpStartTime = undefined;
                    this.jumpDuration = undefined;
                    this.jumpArcHeight = undefined;
                    this.jumpVelocityX = 0;
                    this.jumpAirDrag = Chicken.AIR_DRAG;
                    this.currentBoat = null;
                    this.isOnBoat = false;
                    this.isOnBank = this.checkOnBank();
                    this.safeStayTimer = 0;
                    this.justLanded = true;
                }
            };
            // 开始跳跃动画
            doJumpStep();
        }
        // 获取当前跳跃的预测落点Y位置（基于当前时间）
        getPredictedLandingY() {
            if (!this.isJumping || this.jumpStartTime === undefined) {
                return undefined;
            }
            const elapsed = Laya.Browser.now() - this.jumpStartTime;
            const progress = Math.min(1, elapsed / this.jumpDuration);
            // 使用抛物线公式
            const startY = this.jumpStartY;
            const targetY = this.jumpTargetY;
            const arcHeight = this.jumpArcHeight;
            const t = progress;
            const linearY = startY + (targetY - startY) * t;
            const arcOffset = arcHeight * 4 * t * (1 - t);
            return linearY - arcOffset;
        }
        update(dt) {
            if (this.isOnBoat && this.currentBoat) {
                // 跟随船移动，但允许小鸡在船上左右移动（但不能超出船的范围）
                const targetX = this.currentBoat.getCenterX() - CCR.CHICKEN_WIDTH / 2;
                // 如果是第一次在船上，记录初始偏移
                if (this.lastBoatCenterX === undefined) {
                    this.lastBoatCenterX = targetX;
                }
                const relativeOffset = this.x - this.lastBoatCenterX;
                let newX = targetX + relativeOffset;
                // 限制小鸡在船的范围内移动（留出一点余量）
                const boatLeft = this.currentBoat.x + 2; // 留出2像素余量
                const boatRight = this.currentBoat.x + this.currentBoat.getWidth() - CCR.CHICKEN_WIDTH - 2; // 留出2像素余量
                newX = Math.max(boatLeft, Math.min(boatRight, newX));
                // 确保小鸡不会因为舍入误差而超出边界
                if (newX < boatLeft)
                    newX = boatLeft;
                if (newX > boatRight)
                    newX = boatRight;
                this.x = newX;
                this.lastBoatCenterX = targetX;
                this.safeStayTimer += dt;
                if (this.safeStayTimer >= CCR.SAFE_STAY_TIME && this.lastSafeBoat !== this.currentBoat) {
                    this.lastSafeBoat = this.currentBoat;
                }
            }
            else {
                this.lastBoatCenterX = undefined;
            }
        }
        consumeJustLanded() {
            const landed = this.justLanded;
            this.justLanded = false;
            return landed;
        }
        faceLeft() {
            if (this.facing !== 'left') {
                this.facing = 'left';
                this.createView();
            }
        }
        faceRight() {
            if (this.facing !== 'right') {
                this.facing = 'right';
                this.createView();
            }
        }
        isStandingOnBoat() {
            return this.isOnBoat && this.currentBoat !== null;
        }
        checkOnBank() {
            return this.y >= CCR.BOTTOM_BANK_Y || this.y <= CCR.TOP_BANK_Y + CCR.BANK_HEIGHT;
        }
        isOnTopBank() {
            return this.y <= CCR.TOP_BANK_Y + CCR.BANK_HEIGHT;
        }
        getCenterX() { return this.x + CCR.CHICKEN_WIDTH / 2; }
        getCenterY() { return this.y + CCR.CHICKEN_HEIGHT / 2; }
        getBounds() {
            return { x: this.x, y: this.y, width: CCR.CHICKEN_WIDTH, height: CCR.CHICKEN_HEIGHT };
        }
        checkObstacleCollision(obstacles) {
            const bounds = this.getBounds();
            for (const obstacle of obstacles) {
                const obsBounds = obstacle.getBounds();
                if (bounds.x < obsBounds.x + obsBounds.width &&
                    bounds.x + bounds.width > obsBounds.x &&
                    bounds.y < obsBounds.y + obsBounds.height &&
                    bounds.y + bounds.height > obsBounds.y) {
                    return true;
                }
            }
            return false;
        }
        respawnToLastSafe() {
            Laya.timer.clearAll(this); // 清理所有计时器
            if (this.lastSafeBoat) {
                Laya.Tween.clearAll(this);
                this.isJumping = false;
                this.y = this.lastSafeBoat.y - CCR.CHICKEN_HEIGHT / 2;
                this.x = this.lastSafeBoat.getCenterX() - CCR.CHICKEN_WIDTH / 2;
                this.currentBoat = this.lastSafeBoat;
                this.isOnBoat = true;
                this.isOnBank = false;
                this.jumpVelocityX = 0;
                this.justLanded = false;
            }
            else {
                this.respawnToStart();
            }
        }
        respawnToStart() {
            Laya.timer.clearAll(this); // 清理所有计时器
            Laya.Tween.clearAll(this);
            this.isJumping = false;
            this.isOnBoat = false;
            this.currentBoat = null;
            this.lastSafeBoat = null;
            this.x = CCR.GAME_WIDTH / 2 - CCR.CHICKEN_WIDTH / 2;
            this.y = CCR.BOTTOM_BANK_Y + CCR.BANK_HEIGHT / 2 - CCR.CHICKEN_HEIGHT / 2;
            this.isOnBank = true;
            this.safeStayTimer = 0;
            this.jumpVelocityX = 0;
            this.justLanded = false;
        }
        destroy() {
            Laya.timer.clearAll(this); // 清理所有计时器
            Laya.Tween.clearAll(this);
            super.destroy();
        }
        isJumpingState() { return this.isJumping; }
        isOnBoatState() { return this.isOnBoat; }
        isOnBankState() { return this.isOnBank; }
        getCurrentBoat() { return this.currentBoat; }
        setCurrentBoat(boat) {
            this.currentBoat = boat;
            if (boat) {
                this.isOnBoat = true;
                this.isOnBank = false;
                // 只有在不跳跃时才更新位置
                if (!this.isJumping) {
                    this.y = boat.y + CCR.BOAT_HEIGHT / 2 - CCR.CHICKEN_HEIGHT / 2;
                }
            }
        }
    }
    Chicken.MOVE_SPEED = 5;
    Chicken.AIR_DRAG = 0.92;
    Chicken.HOP_AIR_DRAG = 0.7;
    Chicken.HOP_ARC_HEIGHT = 72;
    Chicken.HORIZONTAL_JUMP_SPEED = 2.8;
    Chicken.HOP_INHERIT_FACTOR = 0.3;
    CCR.Chicken = Chicken;
    // ==================== 简单按钮类 ====================
    class SimpleButton extends Laya.Sprite {
        constructor(label = 'Button') {
            super();
            this._label = '';
            this._enabled = true;
            this.buttonWidth = 120;
            this.buttonHeight = 40;
            this._label = label;
            this.createView();
        }
        createView() {
            this.graphics.clear();
            const bgColor = this._enabled ? '#4CAF50' : '#888';
            this.graphics.drawRect(0, 0, this.buttonWidth, this.buttonHeight, bgColor);
            this.graphics.drawRect(3, 3, this.buttonWidth - 6, this.buttonHeight - 6, this._enabled ? '#45a049' : '#666');
            super.size(this.buttonWidth, this.buttonHeight);
            if (!this.labelText) {
                this.labelText = new Laya.Text();
                this.labelText.fontSize = 16;
                this.labelText.color = '#FFF';
                this.labelText.bold = true;
                this.labelText.align = 'center';
                this.labelText.valign = 'middle';
                this.addChild(this.labelText);
            }
            this.labelText.text = this._label;
            this.labelText.width = this.buttonWidth;
            this.labelText.height = this.buttonHeight;
            this.labelText.pos(0, 0);
        }
        set label(value) {
            this._label = value;
            this.labelText.text = value;
        }
        get label() {
            return this._label;
        }
        set enabled(value) {
            this._enabled = value;
            this.createView();
        }
        get enabled() {
            return this._enabled;
        }
        size(width, height) {
            this.buttonWidth = width;
            this.buttonHeight = height;
            this.createView();
            return this;
        }
    }
    CCR.SimpleButton = SimpleButton;
    // ==================== UI组件 ====================
    class MenuUI extends Laya.Sprite {
        constructor() {
            super();
            this.menuChickenAngle = 0;
            this.menuChickenY = 390;
            this.createUI();
        }
        createUI() {
            this.graphics.drawRect(0, 0, CCR.GAME_WIDTH, CCR.GAME_HEIGHT, '#f2efe5');
            this.graphics.drawRect(0, 0, CCR.GAME_WIDTH, 170, '#cfe8f7');
            this.graphics.drawRect(0, CCR.GAME_HEIGHT - 120, CCR.GAME_WIDTH, 120, '#d8c3a5');
            this.graphics.drawRect(60, 60, 880, 480, '#fffaf0');
            this.graphics.drawRect(72, 72, 856, 456, '#f7f1e1');
            this.graphics.drawRect(90, 90, 820, 6, '#c56b3d');
            this.graphics.drawRect(90, 504, 820, 6, '#c56b3d');
            const leftPanel = new Laya.Sprite();
            leftPanel.graphics.drawRect(0, 0, 360, 340, '#fff4d6');
            leftPanel.graphics.drawRect(0, 0, 360, 8, '#ff9f1c');
            leftPanel.pos(110, 120);
            this.addChild(leftPanel);
            const rightPanel = new Laya.Sprite();
            rightPanel.graphics.drawRect(0, 0, 360, 340, '#f6ead6');
            rightPanel.graphics.drawRect(0, 0, 360, 8, '#8b5e34');
            rightPanel.pos(530, 120);
            this.addChild(rightPanel);
            this.titleText = new Laya.Text();
            this.titleText.text = '小鸡过河';
            this.titleText.fontSize = 56;
            this.titleText.color = '#8b3f1f';
            this.titleText.bold = true;
            this.titleText.pos(150, 130);
            this.addChild(this.titleText);
            const subtitle = new Laya.Text();
            subtitle.text = '穿过六条河道，安全抵达对岸';
            subtitle.fontSize = 22;
            subtitle.color = '#5b6c5d';
            subtitle.pos(152, 190);
            this.addChild(subtitle);
            const intro = new Laya.Text();
            intro.text = '观察木板方向，抓准节奏起跳。\n辅助模式可保留 3 次复活机会。';
            intro.fontSize = 24;
            intro.leading = 14;
            intro.color = '#4d4d4d';
            intro.pos(150, 255);
            intro.width = 280;
            this.addChild(intro);
            this.menuChicken = new Laya.Sprite();
            this.menuChicken.pos(330, 390);
            this.drawMenuChicken(this.menuChicken);
            this.addChild(this.menuChicken);
            Laya.timer.frameLoop(1, this, this.animateMenuChicken);
            const panelTitle = new Laya.Text();
            panelTitle.text = '开始冒险';
            panelTitle.fontSize = 30;
            panelTitle.bold = true;
            panelTitle.color = '#6a4026';
            panelTitle.pos(650, 150);
            this.addChild(panelTitle);
            this.startButton = new SimpleButton('开始游戏');
            this.startButton.size(240, 60);
            this.startButton.pos(590, 215);
            this.startButton.on(Laya.Event.CLICK, this, this.onStartClick);
            this.addChild(this.startButton);
            this.assistMode = StorageHelper.getAssistMode();
            this.assistToggle = new SimpleButton(this.assistMode ? '辅助模式: 开启' : '辅助模式: 关闭');
            this.assistToggle.size(240, 52);
            this.assistToggle.pos(590, 293);
            this.assistToggle.on(Laya.Event.CLICK, this, this.onAssistToggle);
            this.addChild(this.assistToggle);
            const highestLevel = StorageHelper.getHighestLevel();
            this.levelText = new Laya.Text();
            this.levelText.text = `最高关卡: ${highestLevel}`;
            this.levelText.fontSize = 24;
            this.levelText.color = '#5c4b3b';
            this.levelText.pos(590, 370);
            this.addChild(this.levelText);
            this.helpButton = new SimpleButton('游戏说明');
            this.helpButton.size(240, 46);
            this.helpButton.pos(590, 415);
            this.helpButton.on(Laya.Event.CLICK, this, this.onHelpClick);
            this.addChild(this.helpButton);
            const footer = new Laya.Text();
            footer.text = 'WASD / 方向键移动，P 暂停';
            footer.fontSize = 18;
            footer.color = '#7a6856';
            footer.pos(590, 478);
            this.addChild(footer);
            const version = new Laya.Text();
            version.text = 'v1.0.0';
            version.fontSize = 14;
            version.color = '#7a6856';
            version.pos(835, 478);
            this.addChild(version);
        }
        drawMenuChicken(sprite) {
            sprite.graphics.clear();
            // 身体
            sprite.graphics.drawCircle(0, 0, 32, '#FFD700');
            // 眼睛
            sprite.graphics.drawCircle(-12, -8, 6, '#000');
            sprite.graphics.drawCircle(12, -8, 6, '#000');
            // 眼睛高光
            sprite.graphics.drawCircle(-10, -10, 2, '#FFF');
            sprite.graphics.drawCircle(14, -10, 2, '#FFF');
            // 嘴巴
            sprite.graphics.drawRect(-6, 6, 12, 6, '#FF6B35');
            // 鸡冠
            sprite.graphics.drawEllipse(0, -38, 10, 18, '#FF4444');
        }
        animateMenuChicken() {
            this.menuChickenAngle += 0.04;
            this.menuChicken.x = 330 + Math.sin(this.menuChickenAngle) * 26;
            this.menuChicken.y = this.menuChickenY + Math.sin(this.menuChickenAngle * 2.5) * 10;
        }
        onStartClick() {
            this.event('start');
        }
        onHelpClick() {
            this.event('help');
        }
        onAssistToggle() {
            this.assistMode = !this.assistMode;
            DifficultyManager.getInstance().setAssistMode(this.assistMode);
            this.updateAssistToggle();
        }
        updateAssistToggle() {
            this.assistToggle.label = this.assistMode ? '辅助模式: 开启' : '辅助模式: 关闭';
        }
        updateHighestLevel(level) {
            this.levelText.text = `最高关卡: ${level}`;
        }
        destroy() {
            Laya.timer.clearAll(this);
            super.destroy();
        }
    }
    CCR.MenuUI = MenuUI;
    // ==================== 帮助弹窗 ====================
    class HelpPopup extends Laya.Sprite {
        constructor() {
            super();
            this.createUI();
        }
        createUI() {
            this.graphics.drawRect(0, 0, CCR.GAME_WIDTH, CCR.GAME_HEIGHT, 'rgba(0,0,0,0.7)');
            const panel = new Laya.Sprite();
            panel.pos(200, 100);
            panel.graphics.drawRect(0, 0, 600, 400, '#FFF');
            panel.graphics.drawRect(5, 5, 590, 390, '#EEE');
            this.addChild(panel);
            const title = new Laya.Text();
            title.text = '游戏帮助';
            title.fontSize = 32;
            title.color = '#333';
            title.bold = true;
            title.pos(220, 20);
            panel.addChild(title);
            let y = 80;
            const controlsTitle = new Laya.Text();
            controlsTitle.text = '操作控制';
            controlsTitle.fontSize = 22;
            controlsTitle.color = '#4CAF50';
            controlsTitle.bold = true;
            controlsTitle.pos(50, y);
            panel.addChild(controlsTitle);
            y += 30;
            const controls1 = new Laya.Text();
            controls1.text = '↑ / W : 向上跳';
            controls1.fontSize = 18;
            controls1.color = '#666';
            controls1.pos(80, y);
            panel.addChild(controls1);
            y += 25;
            const controls2 = new Laya.Text();
            controls2.text = '↓ / S : 向下跳';
            controls2.fontSize = 18;
            controls2.color = '#666';
            controls2.pos(80, y);
            panel.addChild(controls2);
            y += 25;
            const controls3 = new Laya.Text();
            controls3.text = '← / A : 向左跳';
            controls3.fontSize = 18;
            controls3.color = '#666';
            controls3.pos(80, y);
            panel.addChild(controls3);
            y += 25;
            const controls4 = new Laya.Text();
            controls4.text = '→ / D : 向右跳';
            controls4.fontSize = 18;
            controls4.color = '#666';
            controls4.pos(80, y);
            panel.addChild(controls4);
            y += 35;
            const rulesTitle = new Laya.Text();
            rulesTitle.text = '游戏规则';
            rulesTitle.fontSize = 22;
            rulesTitle.color = '#2196F3';
            rulesTitle.bold = true;
            rulesTitle.pos(50, y);
            panel.addChild(rulesTitle);
            y += 30;
            const rules1 = new Laya.Text();
            rules1.text = '• 帮助小鸡从河底安全到达河岸';
            rules1.fontSize = 18;
            rules1.color = '#666';
            rules1.pos(80, y);
            panel.addChild(rules1);
            y += 25;
            const rules2 = new Laya.Text();
            rules2.text = '• 可以跳上漂浮的木板过河';
            rules2.fontSize = 18;
            rules2.color = '#666';
            rules2.pos(80, y);
            panel.addChild(rules2);
            y += 25;
            const rules3 = new Laya.Text();
            rules3.text = '• 避开河里的障碍物';
            rules3.fontSize = 18;
            rules3.color = '#666';
            rules3.pos(80, y);
            panel.addChild(rules3);
            y += 25;
            const rules4 = new Laya.Text();
            rules4.text = '• 小心不要掉进河里！';
            rules4.fontSize = 18;
            rules4.color = '#666';
            rules4.pos(80, y);
            panel.addChild(rules4);
            y += 35;
            const tipsTitle = new Laya.Text();
            tipsTitle.text = '游戏提示';
            tipsTitle.fontSize = 22;
            tipsTitle.color = '#FF9800';
            tipsTitle.bold = true;
            tipsTitle.pos(50, y);
            panel.addChild(tipsTitle);
            y += 30;
            const tips1 = new Laya.Text();
            tips1.text = '• 辅助模式可以复活继续游戏';
            tips1.fontSize = 18;
            tips1.color = '#666';
            tips1.pos(80, y);
            panel.addChild(tips1);
            y += 25;
            const tips2 = new Laya.Text();
            tips2.text = '• 每关有不同的难度和布局';
            tips1.fontSize = 18;
            tips1.color = '#666';
            tips2.pos(80, y);
            panel.addChild(tips2);
            this.closeButton = new SimpleButton('关闭');
            this.closeButton.size(120, 40);
            this.closeButton.pos(240, 350);
            this.closeButton.on(Laya.Event.CLICK, this, this.onCloseClick);
            panel.addChild(this.closeButton);
        }
        onCloseClick() {
            this.event('close');
        }
    }
    CCR.HelpPopup = HelpPopup;
    class GameUI extends Laya.Sprite {
        constructor() {
            super();
            this.createUI();
        }
        createUI() {
            this.levelText = new Laya.Text();
            this.levelText.text = '关卡: 1';
            this.levelText.fontSize = 20;
            this.levelText.color = '#FFF';
            this.levelText.pos(20, 20);
            this.levelText.stroke = 2;
            this.levelText.strokeColor = '#000';
            this.addChild(this.levelText);
            this.timeText = new Laya.Text();
            this.timeText.text = '时间: 0:00';
            this.timeText.fontSize = 20;
            this.timeText.color = '#FFF';
            this.timeText.pos(120, 20);
            this.timeText.stroke = 2;
            this.timeText.strokeColor = '#000';
            this.addChild(this.timeText);
            this.deathText = new Laya.Text();
            this.deathText.text = '死亡: 0';
            this.deathText.fontSize = 20;
            this.deathText.color = '#FF4444';
            this.deathText.pos(220, 20);
            this.deathText.stroke = 2;
            this.deathText.strokeColor = '#000';
            this.addChild(this.deathText);
            this.pauseButton = new SimpleButton('暂停');
            this.pauseButton.size(80, 30);
            this.pauseButton.pos(900, 20);
            this.pauseButton.on(Laya.Event.CLICK, this, this.onPauseClick);
            this.addChild(this.pauseButton);
        }
        updateStats(stats) {
            const minutes = Math.floor(stats.elapsedTime / 60000);
            const seconds = Math.floor((stats.elapsedTime % 60000) / 1000);
            this.timeText.text = `时间: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            this.deathText.text = `死亡: ${stats.deathCount}`;
        }
        setLevel(level) {
            this.levelText.text = `关卡: ${level}`;
        }
        onPauseClick() {
            this.event('pause');
        }
    }
    CCR.GameUI = GameUI;
    class WinPopup extends Laya.Sprite {
        constructor() {
            super();
            this.stars = [];
            this.createUI();
        }
        createUI() {
            this.graphics.drawRect(0, 0, CCR.GAME_WIDTH, CCR.GAME_HEIGHT, 'rgba(0,0,0,0.7)');
            const panel = new Laya.Sprite();
            panel.pos(300, 150);
            panel.graphics.drawRect(0, 0, 400, 300, '#FFF');
            panel.graphics.drawRect(5, 5, 390, 290, '#EEE');
            this.addChild(panel);
            const title = new Laya.Text();
            title.text = '胜利!';
            title.fontSize = 36;
            title.color = '#FFD700';
            title.bold = true;
            title.pos(150, 30);
            panel.addChild(title);
            for (let i = 0; i < 3; i++) {
                const star = new Laya.Sprite();
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
            this.nextButton = new SimpleButton('下一关');
            this.nextButton.size(120, 40);
            this.nextButton.pos(140, 230);
            this.nextButton.on(Laya.Event.CLICK, this, this.onNextClick);
            panel.addChild(this.nextButton);
            this.retryButton = new SimpleButton('重试');
            this.retryButton.size(120, 40);
            this.retryButton.pos(260, 230);
            this.retryButton.on(Laya.Event.CLICK, this, this.onRetryClick);
            panel.addChild(this.retryButton);
            this.menuButton = new SimpleButton('菜单');
            this.menuButton.size(80, 30);
            this.menuButton.pos(160, 280);
            this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
            panel.addChild(this.menuButton);
        }
        setStars(count) {
            for (let i = 0; i < 3; i++) {
                this.stars[i].graphics.clear();
                const color = i < count ? '#FFD700' : '#DDD';
                this.stars[i].graphics.drawPoly(20, 20, [20, 0, 24, 15, 40, 15, 28, 25, 33, 40, 20, 30, 7, 40, 12, 25, 0, 15, 16, 15], color);
            }
        }
        setTime(time) {
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000);
            this.timeText.text = `用时: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        setNextLevelEnabled(enabled) {
            this.nextButton.enabled = enabled;
        }
        onNextClick() { this.event('next'); }
        onRetryClick() { this.event('retry'); }
        onMenuClick() { this.event('menu'); }
    }
    CCR.WinPopup = WinPopup;
    class LosePopup extends Laya.Sprite {
        constructor() {
            super();
            this.respawnButton = null;
            this.hasRespawn = DifficultyManager.getInstance().getAssistMode();
            this.createUI();
        }
        createUI() {
            this.graphics.drawRect(0, 0, CCR.GAME_WIDTH, CCR.GAME_HEIGHT, 'rgba(0,0,0,0.7)');
            const panel = new Laya.Sprite();
            panel.pos(300, 200);
            panel.graphics.drawRect(0, 0, 400, 200, '#FFF');
            panel.graphics.drawRect(5, 5, 390, 190, '#EEE');
            this.addChild(panel);
            const title = new Laya.Text();
            title.text = '游戏结束';
            title.fontSize = 36;
            title.color = '#FF4444';
            title.bold = true;
            title.pos(120, 30);
            panel.addChild(title);
            this.retryButton = new SimpleButton('重新开始');
            this.retryButton.size(150, 40);
            this.retryButton.pos(125, 100);
            this.retryButton.on(Laya.Event.CLICK, this, this.onRetryClick);
            panel.addChild(this.retryButton);
            if (this.hasRespawn) {
                this.respawnButton = new SimpleButton('复活');
                this.respawnButton.size(150, 40);
                this.respawnButton.pos(125, 150);
                this.respawnButton.on(Laya.Event.CLICK, this, this.onRespawnClick);
                panel.addChild(this.respawnButton);
            }
            this.menuButton = new SimpleButton('菜单');
            this.menuButton.size(80, 30);
            this.menuButton.pos(280, 100);
            this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
            panel.addChild(this.menuButton);
        }
        setRespawnCount(count) {
            if (this.respawnButton) {
                this.respawnButton.enabled = count > 0;
                this.respawnButton.label = `复活 (${count})`;
            }
        }
        onRetryClick() { this.event('retry'); }
        onRespawnClick() { this.event('respawn'); }
        onMenuClick() { this.event('menu'); }
    }
    CCR.LosePopup = LosePopup;
    class PausePopup extends Laya.Sprite {
        constructor() {
            super();
            this.createUI();
        }
        createUI() {
            this.graphics.drawRect(0, 0, CCR.GAME_WIDTH, CCR.GAME_HEIGHT, 'rgba(0,0,0,0.7)');
            const panel = new Laya.Sprite();
            panel.pos(350, 200);
            panel.graphics.drawRect(0, 0, 300, 200, '#FFF');
            panel.graphics.drawRect(5, 5, 290, 190, '#EEE');
            this.addChild(panel);
            const title = new Laya.Text();
            title.text = '游戏暂停';
            title.fontSize = 32;
            title.color = '#333';
            title.bold = true;
            title.pos(80, 30);
            panel.addChild(title);
            this.resumeButton = new SimpleButton('继续游戏');
            this.resumeButton.size(180, 40);
            this.resumeButton.pos(60, 100);
            this.resumeButton.on(Laya.Event.CLICK, this, this.onResumeClick);
            panel.addChild(this.resumeButton);
            this.menuButton = new SimpleButton('返回菜单');
            this.menuButton.size(180, 40);
            this.menuButton.pos(60, 150);
            this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
            panel.addChild(this.menuButton);
        }
        onResumeClick() { this.event('resume'); }
        onMenuClick() { this.event('menu'); }
    }
    CCR.PausePopup = PausePopup;
    // ==================== 游戏主控制 ====================
    class GameMain extends Laya.Sprite {
        constructor() {
            super();
            this.currentState = GameState.Menu;
            this.chicken = null;
            this.boats = [];
            this.obstacles = [];
            this.menuUI = null;
            this.gameUI = null;
            this.winPopup = null;
            this.losePopup = null;
            this.pausePopup = null;
            this.helpPopup = null;
            this.stats = this.createEmptyStats();
            this.startTime = 0;
            this.respawnCount = 3;
            this.isPaused = false;
            this.keys = new Set();
            this.pendingJumpDirection = 0;
            this.pendingJumpExpiresAt = 0;
            this.size(CCR.GAME_WIDTH, CCR.GAME_HEIGHT);
            this.setupInput();
            this.showMenu();
            Laya.timer.frameLoop(1, this, this.onFrameUpdate);
        }
        createEmptyStats() {
            return { elapsedTime: 0, deathCount: 0, jumpCount: 0, successfulJumpCount: 0 };
        }
        setupInput() {
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
        }
        onKeyDown(e) {
            if (this.tryHandleSecretLevelJump(e)) {
                return;
            }
            const keyStr = this.getKeyString(e.keyCode);
            if (keyStr) {
                this.keys.add(keyStr);
            }
        }
        onKeyUp(e) {
            const keyStr = this.getKeyString(e.keyCode);
            if (keyStr)
                this.keys.delete(keyStr);
        }
        getKeyString(keyCode) {
            switch (keyCode) {
                case 65:
                case 37: return 'LEFT';
                case 68:
                case 39: return 'RIGHT';
                case 87:
                case 38: return 'UP';
                case 83:
                case 40: return 'DOWN';
                case 80: return 'PAUSE';
                default: return null;
            }
        }
        showMenu() {
            this.currentState = GameState.Menu;
            this.clearGame();
            this.menuUI = new MenuUI();
            this.menuUI.on('start', this, this.startGame);
            this.menuUI.on('help', this, this.showHelp);
            this.addChild(this.menuUI);
        }
        showHelp() {
            this.helpPopup = new HelpPopup();
            this.helpPopup.on('close', this, this.hideHelp);
            this.addChild(this.helpPopup);
        }
        hideHelp() {
            if (this.helpPopup) {
                this.removeChild(this.helpPopup);
                this.helpPopup = null;
            }
        }
        startGame() {
            if (this.menuUI)
                this.removeChild(this.menuUI);
            this.initLevel(LevelManager.getInstance().getCurrentLevel());
        }
        initLevel(level) {
            this.currentState = GameState.Playing;
            this.stats = this.createEmptyStats();
            this.startTime = Laya.Browser.now();
            this.respawnCount = DifficultyManager.getInstance().getAssistMode() ? 3 : 0;
            this.isPaused = false;
            const levelConfig = LevelManager.getInstance().getLevelConfig(level);
            if (!levelConfig) {
                Debug.error('Level config not found:', level);
                return;
            }
            this.createBackground();
            this.createBanks();
            this.createLanes(levelConfig);
            this.createChicken();
            this.createGameUI();
        }
        createBackground() {
            const riverStartY = CCR.TOP_BANK_Y + CCR.BANK_HEIGHT;
            const riverEndY = CCR.BOTTOM_BANK_Y;
            const riverHeight = riverEndY - riverStartY;
            const laneHeight = riverHeight / CCR.RIVER_LANE_COUNT;
            const colors = ['#0b7fab', '#1696b5', '#207dc2', '#2b97d3', '#0f88c0', '#36a6c9'];
            for (let laneIndex = 0; laneIndex < CCR.RIVER_LANE_COUNT; laneIndex++) {
                const laneStartY = riverStartY + laneIndex * laneHeight;
                const laneColor = colors[laneIndex % colors.length];
                this.graphics.drawRect(0, laneStartY, CCR.GAME_WIDTH, laneHeight, laneColor);
                this.graphics.drawRect(0, laneStartY, CCR.GAME_WIDTH, 3, '#d8f3ff');
                this.graphics.drawRect(0, laneStartY + laneHeight - 4, CCR.GAME_WIDTH, 4, '#0d5777');
            }
        }
        createBanks() {
            // 底部赭红色河岸（出发区域）
            const bottomBank = new Laya.Sprite();
            bottomBank.graphics.drawRect(0, CCR.BOTTOM_BANK_Y, CCR.GAME_WIDTH, CCR.BANK_HEIGHT, '#8B4513');
            // 添加纹理效果（用小圆点模拟泥土质感）
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * CCR.GAME_WIDTH;
                const y = CCR.BOTTOM_BANK_Y + 5 + Math.random() * (CCR.BANK_HEIGHT - 10);
                bottomBank.graphics.drawCircle(x, y, 3, '#A0522D');
            }
            // 顶部边缘线
            bottomBank.graphics.drawRect(0, CCR.BOTTOM_BANK_Y, CCR.GAME_WIDTH, 3, '#654321');
            this.addChild(bottomBank);
            // 顶部赭红色河岸（到达区域）
            const topBank = new Laya.Sprite();
            topBank.graphics.drawRect(0, CCR.TOP_BANK_Y, CCR.GAME_WIDTH, CCR.BANK_HEIGHT, '#8B4513');
            // 添加纹理效果
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * CCR.GAME_WIDTH;
                const y = 5 + Math.random() * (CCR.BANK_HEIGHT - 10);
                topBank.graphics.drawCircle(x, y, 3, '#A0522D');
            }
            // 底部边缘线
            topBank.graphics.drawRect(0, CCR.TOP_BANK_Y + CCR.BANK_HEIGHT - 3, CCR.GAME_WIDTH, 3, '#654321');
            this.addChild(topBank);
        }
        createLanes(config) {
            const difficulty = DifficultyManager.getInstance();
            const boatLength = config.boatLength * difficulty.getLengthMultiplier();
            const riverStartY = CCR.TOP_BANK_Y + CCR.BANK_HEIGHT;
            const laneHeight = CCR.LANE_GAP;
            for (let laneIndex = 0; laneIndex < CCR.RIVER_LANE_COUNT; laneIndex++) {
                // 计算河道Y位置（从顶部河岸向下排列，与背景绘制一致）
                const laneStartY = riverStartY + laneIndex * laneHeight;
                // 确定这条河道的船的方向（单向）
                const laneDirection = laneIndex % 2 === 0 ? 1 : -1;
                // 每条河道都生成船（最后一条也必须有）
                const boatCount = Math.random() < 0.7 ? (Math.random() < 0.5 ? 2 : 1) : 1;
                // 记录已生成的船的位置，确保间距
                const spawnedPositions = [];
                for (let i = 0; i < boatCount; i++) {
                    let x;
                    let attempts = 0;
                    const maxAttempts = 10;
                    do {
                        if (laneDirection === 1) {
                            // 向右移动的船从左边随机位置开始（包含屏幕外）
                            x = Math.random() * (CCR.GAME_WIDTH + boatLength) - boatLength;
                        }
                        else {
                            // 向左移动的船从右边随机位置开始（包含屏幕外）
                            x = Math.random() * (CCR.GAME_WIDTH + boatLength);
                        }
                        attempts++;
                    } while (attempts < maxAttempts &&
                        spawnedPositions.some(pos => Math.abs(x - pos) < boatLength * 2));
                    // 添加到已生成位置列表
                    spawnedPositions.push(x);
                    // 创建船，确保船在河道中央（Y方向）
                    const boatY = laneStartY + laneHeight / 2 - CCR.BOAT_HEIGHT / 2;
                    const boat = new Boat(x, boatY, boatLength, config.boatSpeed, laneDirection);
                    this.boats.push(boat);
                    this.addChild(boat);
                }
                if (!difficulty.shouldHideObstacles()) {
                    for (let i = 0; i < Math.min(config.obstacles, 3); i++) {
                        const x = 100 + i * 300 + laneIndex * 50;
                        const direction = (laneIndex + i + 1) % 2 === 0 ? 1 : -1;
                        const obstacle = new Obstacle(x, laneStartY + laneHeight / 2 - CCR.OBSTACLE_HEIGHT / 2, config.boatSpeed * 0.8, direction);
                        this.obstacles.push(obstacle);
                        this.addChild(obstacle);
                    }
                }
            }
        }
        createChicken() {
            this.chicken = new Chicken();
            this.addChild(this.chicken);
        }
        createGameUI() {
            this.gameUI = new GameUI();
            this.gameUI.on('pause', this, this.onPause);
            this.gameUI.setLevel(LevelManager.getInstance().getCurrentLevel());
            this.addChild(this.gameUI);
        }
        onPause() {
            if (this.currentState !== GameState.Playing)
                return;
            this.currentState = GameState.Paused;
            this.isPaused = true;
            this.pausePopup = new PausePopup();
            this.pausePopup.on('resume', this, this.onResume);
            this.pausePopup.on('menu', this, this.showMenu);
            this.addChild(this.pausePopup);
        }
        onResume() {
            if (this.pausePopup) {
                this.removeChild(this.pausePopup);
                this.pausePopup.destroy();
                this.pausePopup = null;
            }
            this.currentState = GameState.Playing;
            this.isPaused = false;
        }
        onFrameUpdate() {
            if (this.isPaused)
                return;
            if (this.currentState === GameState.Playing) {
                this.updateGame();
            }
        }
        updateGame() {
            this.updateStats();
            this.handleInput();
            this.updateBoats();
            this.updateObstacles();
            if (this.chicken) {
                this.chicken.update(16);
                this.resolveLanding();
                if (this.currentState !== GameState.Playing) {
                    return;
                }
                this.checkWin();
                this.checkLose();
            }
        }
        updateStats() {
            this.stats.elapsedTime = Laya.Browser.now() - this.startTime;
            if (this.gameUI)
                this.gameUI.updateStats(this.stats);
        }
        handleInput() {
            if (!this.chicken || this.chicken.isJumpingState()) {
                return;
            }
            if (this.keys.has('LEFT'))
                this.chicken.moveLeft();
            if (this.keys.has('RIGHT'))
                this.chicken.moveRight();
            this.resolvePendingJump();
            if (this.keys.has('UP')) {
                this.handleDirectionalJumpInput(-1);
                this.keys.delete('UP');
            }
            if (this.keys.has('DOWN')) {
                this.handleDirectionalJumpInput(1);
                this.keys.delete('DOWN');
            }
            if (this.keys.has('PAUSE')) {
                this.onPause();
                this.keys.delete('PAUSE');
            }
        }
        handleDirectionalJumpInput(direction) {
            if (!this.chicken || this.chicken.isJumpingState()) {
                return;
            }
            const horizontalIntent = this.keys.has('LEFT') ? -1 : this.keys.has('RIGHT') ? 1 : 0;
            if (horizontalIntent === 0 && this.chicken.isStandingOnBoat() && direction === -1) {
                this.pendingJumpDirection = direction;
                this.pendingJumpExpiresAt = Laya.Browser.now() + GameMain.JUMP_COMBO_WINDOW_MS;
                return;
            }
            this.clearPendingJump();
            this.handleJump(direction, horizontalIntent, false);
        }
        resolvePendingJump() {
            if (!this.chicken || this.pendingJumpDirection === 0 || this.chicken.isJumpingState()) {
                return;
            }
            const horizontalIntent = this.keys.has('LEFT') ? -1 : this.keys.has('RIGHT') ? 1 : 0;
            if (horizontalIntent !== 0) {
                const direction = this.pendingJumpDirection;
                this.clearPendingJump();
                this.handleJump(direction, horizontalIntent, false);
                return;
            }
            if (Laya.Browser.now() >= this.pendingJumpExpiresAt) {
                const direction = this.pendingJumpDirection;
                this.clearPendingJump();
                if (this.chicken.isStandingOnBoat()) {
                    this.handleJump(direction, 0, true);
                }
            }
        }
        clearPendingJump() {
            this.pendingJumpDirection = 0;
            this.pendingJumpExpiresAt = 0;
        }
        handleJump(direction, horizontalIntent, isHop) {
            if (!this.chicken || this.chicken.isJumpingState()) {
                DifficultyManager.getInstance().recordJump(false);
                return;
            }
            if (horizontalIntent < 0) {
                this.chicken.faceLeft();
            }
            else if (horizontalIntent > 0) {
                this.chicken.faceRight();
            }
            const currentY = this.chicken.y;
            const riverStartY = CCR.TOP_BANK_Y + CCR.BANK_HEIGHT;
            const topLaneTargetY = riverStartY + CCR.LANE_GAP / 2 - CCR.CHICKEN_HEIGHT / 2;
            const bottomLaneTargetY = riverStartY + (CCR.RIVER_LANE_COUNT - 1) * CCR.LANE_GAP + CCR.LANE_GAP / 2 - CCR.CHICKEN_HEIGHT / 2;
            const extraVelocityX = horizontalIntent * Chicken.HORIZONTAL_JUMP_SPEED;
            let targetY;
            if (isHop && this.chicken.isStandingOnBoat()) {
                targetY = currentY;
                this.chicken.jump(targetY, 0, Chicken.HOP_ARC_HEIGHT, Chicken.HOP_INHERIT_FACTOR, Chicken.HOP_AIR_DRAG);
                this.stats.jumpCount++;
                return;
            }
            // 如果小鸡在底部河岸上（y >= BOTTOM_BANK_Y - CHICKEN_HEIGHT）
            if (currentY >= CCR.BOTTOM_BANK_Y - CCR.CHICKEN_HEIGHT) {
                if (direction === -1) {
                    // 从底部河岸向上跳到第一条河道
                    targetY = bottomLaneTargetY;
                }
                else {
                    // 向下跳，保持在底部河岸
                    targetY = CCR.BOTTOM_BANK_Y + CCR.BANK_HEIGHT / 2 - CCR.CHICKEN_HEIGHT / 2;
                    DifficultyManager.getInstance().recordJump(false);
                    this.stats.jumpCount++;
                    return;
                }
            }
            // 如果小鸡已经在顶部河岸或以上
            else if (currentY <= CCR.TOP_BANK_Y + CCR.BANK_HEIGHT - CCR.CHICKEN_HEIGHT) {
                if (direction === 1) {
                    // 从顶部河岸向下跳到最上面的河道
                    targetY = topLaneTargetY;
                }
                else {
                    // 向上跳，已经在顶部，尝试跳到岸上
                    targetY = CCR.TOP_BANK_Y + CCR.BANK_HEIGHT - CCR.CHICKEN_HEIGHT;
                    this.chicken.jump(targetY, extraVelocityX);
                    this.stats.jumpCount++;
                    return;
                }
            }
            // 在河道中间
            else {
                // 直接计算目标位置，每次跳跃正好一个 LANE_GAP
                targetY = currentY + direction * CCR.LANE_GAP;
                // 如果向上跳且到达顶部河岸区域，则跳到岸上
                if (direction === -1 && targetY < CCR.TOP_BANK_Y + CCR.BANK_HEIGHT - CCR.CHICKEN_HEIGHT) {
                    targetY = CCR.TOP_BANK_Y + CCR.BANK_HEIGHT - CCR.CHICKEN_HEIGHT;
                }
            }
            this.chicken.jump(targetY, extraVelocityX);
            this.stats.jumpCount++;
        }
        findBoatAtPosition(x, targetY) {
            let closestBoat = null;
            let minDistance = Infinity;
            // 扩大检测范围，确保小鸡能准确跳到船上
            const verticalTolerance = 30; // 垂直方向的容差
            for (const boat of this.boats) {
                const boatTop = boat.y;
                const boatBottom = boat.y + CCR.BOAT_HEIGHT;
                // 检测小鸡的底部是否在船的范围内（扩大垂直检测范围）
                const chickenBottom = targetY + CCR.CHICKEN_HEIGHT;
                const chickenCenterY = targetY + CCR.CHICKEN_HEIGHT / 2;
                // 检查小鸡中心是否在船的Y范围内
                if (chickenCenterY >= boatTop - verticalTolerance &&
                    chickenCenterY <= boatBottom + verticalTolerance) {
                    if (boat.containsPoint(x)) {
                        const distance = Math.abs(x - boat.getCenterX());
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestBoat = boat;
                        }
                    }
                }
            }
            return closestBoat;
        }
        updateBoats() {
            for (const boat of this.boats)
                boat.update();
        }
        updateObstacles() {
            for (const obstacle of this.obstacles)
                obstacle.update();
        }
        checkWin() {
            if (!this.chicken)
                return;
            if (!this.chicken.isJumpingState() && this.chicken.isOnTopBank()) {
                this.onWin();
            }
        }
        resolveLanding() {
            if (!this.chicken || !this.chicken.consumeJustLanded()) {
                return;
            }
            if (this.chicken.isOnBankState()) {
                DifficultyManager.getInstance().recordJump(true);
                this.stats.successfulJumpCount++;
                return;
            }
            const boat = this.findBoatAtPosition(this.chicken.getCenterX(), this.chicken.y);
            if (boat) {
                this.chicken.setCurrentBoat(boat);
                DifficultyManager.getInstance().recordJump(true);
                this.stats.successfulJumpCount++;
                return;
            }
            DifficultyManager.getInstance().recordJump(false);
            this.onLose();
        }
        checkLose() {
            if (!this.chicken)
                return;
            // 如果小鸡在船上且没有跳跃，不会落水（只要不起跳，就不会落水）
            if (this.chicken.isOnBoatState() && !this.chicken.isJumpingState()) {
                if (this.chicken.checkObstacleCollision(this.obstacles)) {
                    this.onLose();
                    return;
                }
                // 只有当船带小鸡超出屏幕边缘时才失败
                if (this.chicken.x < -CCR.CHICKEN_WIDTH || this.chicken.x > CCR.GAME_WIDTH) {
                    this.onLose();
                    return;
                }
                // 否则安全，不检测落水
                return;
            }
            // 检测小鸡是否完全超出屏幕边缘（完全移出屏幕才失败）
            const edgeThreshold = 10; // 允许超出10像素
            if (this.chicken.x < -CCR.CHICKEN_WIDTH + edgeThreshold ||
                this.chicken.x > CCR.GAME_WIDTH - edgeThreshold) {
                this.onLose();
                return;
            }
            // 如果正在跳跃，不检测落水
            if (this.chicken.isJumpingState()) {
                return;
            }
            if (this.chicken.checkObstacleCollision(this.obstacles)) {
                this.onLose();
                return;
            }
            // 如果已经在岸上，不检测落水
            if (this.chicken.isOnBankState()) {
                return;
            }
            // 重新检测是否有船在小鸡当前位置（船可能在跳跃过程中移动到落点）
            const chickenX = this.chicken.getCenterX();
            const chickenY = this.chicken.y;
            const boat = this.findBoatAtPosition(chickenX, chickenY);
            if (boat) {
                // 找到船，小鸡在船上，设置状态
                this.chicken.setCurrentBoat(boat);
                return;
            }
            // 不在船上、不在岸上、不在跳跃，判定为落水
            this.onLose();
        }
        onWin() {
            this.currentState = GameState.Win;
            const level = LevelManager.getInstance().getCurrentLevel();
            StorageHelper.setHighestLevel(level);
            let stars = 1;
            if (this.stats.elapsedTime < 45000)
                stars = 2;
            if (this.stats.elapsedTime < 30000 && this.stats.deathCount === 0)
                stars = 3;
            StorageHelper.setStars(level, stars);
            this.winPopup = new WinPopup();
            this.winPopup.setStars(stars);
            this.winPopup.setTime(this.stats.elapsedTime);
            this.winPopup.setNextLevelEnabled(LevelManager.getInstance().hasNextLevel());
            this.winPopup.on('next', this, this.onNextLevel);
            this.winPopup.on('retry', this, this.onRetry);
            this.winPopup.on('menu', this, this.showMenu);
            this.addChild(this.winPopup);
        }
        onLose() {
            this.currentState = GameState.Lose;
            this.stats.deathCount++;
            this.losePopup = new LosePopup();
            this.losePopup.setRespawnCount(this.respawnCount);
            this.losePopup.on('retry', this, this.onRetry);
            this.losePopup.on('respawn', this, this.onRespawn);
            this.losePopup.on('menu', this, this.showMenu);
            this.addChild(this.losePopup);
        }
        onRespawn() {
            if (this.respawnCount <= 0)
                return;
            this.respawnCount--;
            if (this.losePopup) {
                this.removeChild(this.losePopup);
                this.losePopup.destroy();
                this.losePopup = null;
            }
            if (this.chicken)
                this.chicken.respawnToLastSafe();
            this.currentState = GameState.Playing;
        }
        onNextLevel() {
            LevelManager.getInstance().nextLevel();
            this.onRetry();
        }
        onRetry() {
            this.clearPopups();
            this.clearGame();
            this.initLevel(LevelManager.getInstance().getCurrentLevel());
        }
        clearPopups() {
            if (this.winPopup) {
                this.winPopup.destroy();
                this.winPopup = null;
            }
            if (this.losePopup) {
                this.losePopup.destroy();
                this.losePopup = null;
            }
            if (this.pausePopup) {
                this.pausePopup.destroy();
                this.pausePopup = null;
            }
        }
        clearGame() {
            while (this.numChildren > 0) {
                const child = this.getChildAt(0);
                child.destroy();
            }
            this.boats = [];
            this.obstacles = [];
            this.chicken = null;
            this.gameUI = null;
        }
        tryHandleSecretLevelJump(e) {
            const keyboardEvent = e;
            if (!keyboardEvent.altKey) {
                return false;
            }
            let targetLevel = null;
            if (keyboardEvent.keyCode >= 49 && keyboardEvent.keyCode <= 57) {
                targetLevel = keyboardEvent.keyCode - 48;
            }
            else if (keyboardEvent.keyCode === 48) {
                targetLevel = 10;
            }
            if (targetLevel === null) {
                return false;
            }
            const maxLevel = LevelManager.getInstance().getTotalLevels();
            if (targetLevel < 1 || targetLevel > maxLevel) {
                return true;
            }
            this.jumpToLevel(targetLevel);
            return true;
        }
        jumpToLevel(level) {
            LevelManager.getInstance().setCurrentLevel(level);
            this.keys.clear();
            this.pendingJumpDirection = 0;
            this.pendingJumpExpiresAt = 0;
            this.isPaused = false;
            this.hideHelp();
            this.clearPopups();
            this.clearGame();
            this.initLevel(level);
        }
    }
    GameMain.JUMP_COMBO_WINDOW_MS = 140;
    CCR.GameMain = GameMain;
    // ==================== 启动游戏 ====================
    function initGame() {
        // LayaAir 3.x 使用Promise异步初始化
        Laya.init({
            designWidth: CCR.GAME_WIDTH,
            designHeight: CCR.GAME_HEIGHT,
            scaleMode: 'exactfit',
            screenMode: 'horizontal',
            alignV: 'middle',
            alignH: 'center'
        }).then(() => {
            const gameMain = new GameMain();
            Laya.stage.addChild(gameMain);
        }).catch((err) => {
            Debug.error('Init failed:', err);
        });
    }
    CCR.initGame = initGame;
})(CCR || (CCR = {}));
// 页面加载完成后启动游戏
window.onload = function () {
    CCR.initGame();
};
//# sourceMappingURL=bundle.js.map