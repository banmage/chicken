import {
    GameState, LevelConfig, LevelStats, GAME_WIDTH, GAME_HEIGHT,
    BOTTOM_BANK_Y, TOP_BANK_Y, BANK_HEIGHT, LANE_HEIGHT, LANE_GAP,
    CHICKEN_WIDTH, CHICKEN_HEIGHT, BOAT_HEIGHT, OBSTACLE_HEIGHT
} from '../data/types';
import { Chicken } from './Chicken';
import { Boat } from './Boat';
import { Obstacle } from './Obstacle';
import { MenuUI } from '../ui/MenuUI';
import { GameUI } from '../ui/GameUI';
import { WinPopup } from '../ui/WinPopup';
import { LosePopup } from '../ui/LosePopup';
import { PausePopup } from '../ui/PausePopup';
import { LevelManager } from '../managers/LevelManager';
import { DifficultyManager } from '../managers/DifficultyManager';
import { StorageHelper } from '../utils/StorageHelper';
import { Debug } from '../utils/Debug';

export class GameMain extends Laya.Sprite {
    private currentState: GameState = GameState.Menu;
    private chicken: Chicken | null = null;
    private boats: Boat[] = [];
    private obstacles: Obstacle[] = [];
    private menuUI: MenuUI | null = null;
    private gameUI: GameUI | null = null;
    private winPopup: WinPopup | null = null;
    private losePopup: LosePopup | null = null;
    private pausePopup: PausePopup | null = null;
    private stats: LevelStats = this.createEmptyStats();
    private startTime: number = 0;
    private respawnCount: number = 3;
    private isPaused: boolean = false;

    private keys: Set<string> = new Set();

    constructor() {
        super();
        this.size(GAME_WIDTH, GAME_HEIGHT);
        this.setupInput();
        this.showMenu();
        Laya.timer.frameLoop(1, this, this.onFrameUpdate);
    }

    private createEmptyStats(): LevelStats {
        return {
            elapsedTime: 0,
            deathCount: 0,
            jumpCount: 0,
            successfulJumpCount: 0
        };
    }

    private setupInput(): void {
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);
        Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp);
    }

    private onKeyDown(e: Laya.Event): void {
        const key = (e as unknown as { keyCode: number }).keyCode;
        const keyStr = this.getKeyString(key);
        if (keyStr) {
            this.keys.add(keyStr);
        }
    }

    private onKeyUp(e: Laya.Event): void {
        const key = (e as unknown as { keyCode: number }).keyCode;
        const keyStr = this.getKeyString(key);
        if (keyStr) {
            this.keys.delete(keyStr);
        }
    }

    private getKeyString(keyCode: number): string | null {
        switch (keyCode) {
            case 65: case 37: return 'LEFT';
            case 68: case 39: return 'RIGHT';
            case 87: case 38: return 'UP';
            case 83: case 40: return 'DOWN';
            case 80: return 'PAUSE';
            default: return null;
        }
    }

    private showMenu(): void {
        this.currentState = GameState.Menu;
        this.clearGame();
        
        if (!this.menuUI) {
            this.menuUI = new MenuUI();
            this.menuUI.on('start', this, this.startGame);
        }
        this.addChild(this.menuUI);
    }

    private startGame(): void {
        this.hideMenu();
        this.initLevel(LevelManager.getInstance().getCurrentLevel());
    }

    private hideMenu(): void {
        if (this.menuUI) {
            this.removeChild(this.menuUI);
        }
    }

    private initLevel(level: number): void {
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

    private createBackground(): void {
        this.graphics.drawRect(0, 0, GAME_WIDTH, GAME_HEIGHT, '#87CEEB');
    }

    private createBanks(): void {
        const bottomBank = new Laya.Sprite();
        bottomBank.graphics.drawRect(0, BOTTOM_BANK_Y, GAME_WIDTH, BANK_HEIGHT, '#8B4513');
        bottomBank.graphics.drawRect(0, BOTTOM_BANK_Y, GAME_WIDTH, 5, '#654321');
        this.addChild(bottomBank);

        const topBank = new Laya.Sprite();
        topBank.graphics.drawRect(0, TOP_BANK_Y, GAME_WIDTH, BANK_HEIGHT, '#228B22');
        topBank.graphics.drawRect(0, BANK_HEIGHT - 5, GAME_WIDTH, 5, '#006400');
        this.addChild(topBank);
    }

    private createLanes(config: LevelConfig): void {
        const difficulty = DifficultyManager.getInstance();
        const boatLength = config.boatLength * difficulty.getLengthMultiplier();

        for (let laneIndex = 0; laneIndex < config.lanes; laneIndex++) {
            const laneY = 120 + laneIndex * LANE_GAP;

            const laneBg = new Laya.Sprite();
            laneBg.graphics.drawRect(0, laneY, GAME_WIDTH, LANE_HEIGHT, '#1E90FF');
            this.addChild(laneBg);

            for (let i = 0; i < config.boatsPerLane; i++) {
                const x = (GAME_WIDTH / (config.boatsPerLane + 1)) * (i + 1);
                const direction = (laneIndex + i) % 2 === 0 ? 1 : -1;
                const boat = new Boat(x, laneY + LANE_HEIGHT / 2 - BOAT_HEIGHT / 2, boatLength, config.boatSpeed, direction);
                this.boats.push(boat);
                this.addChild(boat);
            }

            if (!difficulty.shouldHideObstacles()) {
                for (let i = 0; i < Math.min(config.obstacles, 3); i++) {
                    const x = 100 + i * 300 + laneIndex * 50;
                    const direction = (laneIndex + i + 1) % 2 === 0 ? 1 : -1;
                    const obstacle = new Obstacle(x, laneY + LANE_HEIGHT / 2 - OBSTACLE_HEIGHT / 2, config.boatSpeed * 0.8, direction);
                    this.obstacles.push(obstacle);
                    this.addChild(obstacle);
                }
            }
        }
    }

    private createChicken(): void {
        this.chicken = new Chicken();
        this.addChild(this.chicken);
    }

    private createGameUI(): void {
        if (!this.gameUI) {
            this.gameUI = new GameUI();
            this.gameUI.on('pause', this, this.onPause);
        }
        this.gameUI.setLevel(LevelManager.getInstance().getCurrentLevel());
        this.addChild(this.gameUI);
    }

    private onPause(): void {
        if (this.currentState !== GameState.Playing) return;
        
        this.currentState = GameState.Paused;
        this.isPaused = true;

        this.pausePopup = new PausePopup();
        this.pausePopup.on('resume', this, this.onResume);
        this.pausePopup.on('menu', this, this.showMenu);
        this.addChild(this.pausePopup);
    }

    private onResume(): void {
        if (this.pausePopup) {
            this.removeChild(this.pausePopup);
            this.pausePopup.destroy();
            this.pausePopup = null;
        }
        this.currentState = GameState.Playing;
        this.isPaused = false;
    }

    private onFrameUpdate(): void {
        if (this.isPaused) return;

        switch (this.currentState) {
            case GameState.Playing:
                this.updateGame();
                break;
        }
    }

    private updateGame(): void {
        this.updateStats();
        this.handleInput();
        this.updateBoats();
        this.updateObstacles();
        if (this.chicken) {
            this.chicken.update(16);
            this.checkWin();
            this.checkLose();
        }
    }

    private updateStats(): void {
        this.stats.elapsedTime = Laya.Browser.now() - this.startTime;
        if (this.gameUI) {
            this.gameUI.updateStats(this.stats);
        }
    }

    private handleInput(): void {
        if (!this.chicken || this.chicken.isJumpingState()) {
            if (this.keys.has('LEFT') || this.keys.has('RIGHT')) {
                return;
            }
        }

        if (this.keys.has('LEFT') && this.chicken) {
            this.chicken.moveLeft();
        }
        if (this.keys.has('RIGHT') && this.chicken) {
            this.chicken.moveRight();
        }
        if (this.keys.has('UP')) {
            this.handleJump(-1);
            this.keys.delete('UP');
        }
        if (this.keys.has('DOWN')) {
            this.handleJump(1);
            this.keys.delete('DOWN');
        }
        if (this.keys.has('PAUSE')) {
            this.onPause();
            this.keys.delete('PAUSE');
        }
    }

    private handleJump(direction: number): void {
        if (!this.chicken || this.chicken.isJumpingState()) {
            DifficultyManager.getInstance().recordJump(false);
            return;
        }

        const currentY = this.chicken.y;
        let targetY = currentY + direction * LANE_GAP;

        if (direction === -1 && targetY < TOP_BANK_Y + BANK_HEIGHT) {
            targetY = TOP_BANK_Y + BANK_HEIGHT - CHICKEN_HEIGHT;
        } else if (direction === 1 && targetY > BOTTOM_BANK_Y - CHICKEN_HEIGHT) {
            targetY = BOTTOM_BANK_Y - CHICKEN_HEIGHT;
        }

        const targetBoat = this.findBoatAtPosition(this.chicken.getCenterX(), targetY);

        if (targetBoat) {
            this.chicken.jump(targetY, targetBoat);
            this.stats.jumpCount++;
            DifficultyManager.getInstance().recordJump(true);
            this.stats.successfulJumpCount++;
        } else if (direction === -1 && targetY <= TOP_BANK_Y + BANK_HEIGHT) {
            this.chicken.jump(targetY, null);
            this.stats.jumpCount++;
            DifficultyManager.getInstance().recordJump(true);
            this.stats.successfulJumpCount++;
        } else {
            DifficultyManager.getInstance().recordJump(false);
        }
    }

    private findBoatAtPosition(x: number, targetY: number): Boat | null {
        let closestBoat: Boat | null = null;
        let minDistance = Infinity;

        for (const boat of this.boats) {
            const boatTop = boat.y;
            const boatBottom = boat.y + BOAT_HEIGHT;

            if (targetY >= boatTop - CHICKEN_HEIGHT && targetY <= boatBottom) {
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

    private updateBoats(): void {
        for (const boat of this.boats) {
            boat.update();
        }
    }

    private updateObstacles(): void {
        for (const obstacle of this.obstacles) {
            obstacle.update();
        }
    }

    private checkWin(): void {
        if (!this.chicken) return;

        if (!this.chicken.isJumpingState() && this.chicken.isOnTopBank()) {
            this.onWin();
        }
    }

    private checkLose(): void {
        if (!this.chicken) return;

        if (this.chicken.checkObstacleCollision(this.obstacles)) {
            this.onLose();
            return;
        }

        if (!this.chicken.isJumpingState() && !this.chicken.isOnBoatState() && !this.chicken.isOnBankState()) {
            this.onLose();
        }
    }

    private onWin(): void {
        this.currentState = GameState.Win;

        const level = LevelManager.getInstance().getCurrentLevel();
        StorageHelper.setHighestLevel(level);

        let stars = 1;
        if (this.stats.elapsedTime < 45000) stars = 2;
        if (this.stats.elapsedTime < 30000 && this.stats.deathCount === 0) stars = 3;
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

    private onLose(): void {
        this.currentState = GameState.Lose;
        this.stats.deathCount++;

        this.losePopup = new LosePopup();
        this.losePopup.setRespawnCount(this.respawnCount);
        this.losePopup.on('retry', this, this.onRetry);
        this.losePopup.on('respawn', this, this.onRespawn);
        this.losePopup.on('menu', this, this.showMenu);
        this.addChild(this.losePopup);
    }

    private onRespawn(): void {
        if (this.respawnCount <= 0) return;

        this.respawnCount--;
        
        if (this.losePopup) {
            this.removeChild(this.losePopup);
            this.losePopup.destroy();
            this.losePopup = null;
        }

        if (this.chicken) {
            this.chicken.respawnToLastSafe();
        }
        this.currentState = GameState.Playing;
    }

    private onNextLevel(): void {
        const levelManager = LevelManager.getInstance();
        levelManager.nextLevel();
        this.onRetry();
    }

    private onRetry(): void {
        this.clearPopups();
        this.clearGame();
        this.initLevel(LevelManager.getInstance().getCurrentLevel());
    }

    private clearPopups(): void {
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

    private clearGame(): void {
        while (this.numChildren > 0) {
            const child = this.getChildAt(0);
            child.destroy();
        }
        
        this.boats = [];
        this.obstacles = [];
        this.chicken = null;
        this.gameUI = null;
    }

    public destroy(): void {
        Laya.stage.offAll(Laya.Event.KEY_DOWN);
        Laya.stage.offAll(Laya.Event.KEY_UP);
        Laya.timer.clearAll(this);
        this.clearGame();
        this.clearPopups();
        if (this.menuUI) {
            this.menuUI.destroy();
        }
        super.destroy();
    }
}