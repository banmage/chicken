import { StorageHelper } from '../utils/StorageHelper';

export class DifficultyManager {
    private static instance: DifficultyManager;
    private jumpHistory: boolean[] = [];
    private speedMultiplier: number = 1;
    private lengthMultiplier: number = 1;
    private obstacleSpeedMultiplier: number = 1;
    private hideObstacles: boolean = false;

    private constructor() {}

    public static getInstance(): DifficultyManager {
        if (!DifficultyManager.instance) {
            DifficultyManager.instance = new DifficultyManager();
        }
        return DifficultyManager.instance;
    }

    public recordJump(success: boolean): void {
        this.jumpHistory.push(success);
        if (this.jumpHistory.length > 5) {
            this.jumpHistory.shift();
        }
        this.updateDifficulty();
    }

    private updateDifficulty(): void {
        if (this.jumpHistory.length < 5) return;

        const successRate = this.jumpHistory.filter(Boolean).length / this.jumpHistory.length;

        if (successRate < 0.4) {
            this.decreaseDifficulty();
        } else if (successRate > 0.8) {
            this.increaseDifficulty();
        }
    }

    private decreaseDifficulty(): void {
        this.speedMultiplier = Math.max(0.5, this.speedMultiplier * 0.85);
        this.lengthMultiplier = Math.min(2, this.lengthMultiplier * 1.1);
        this.hideObstacles = true;
    }

    private increaseDifficulty(): void {
        this.speedMultiplier = Math.min(2, this.speedMultiplier * 1.15);
        this.lengthMultiplier = Math.max(0.5, this.lengthMultiplier * 0.95);
        this.obstacleSpeedMultiplier = Math.min(2, this.obstacleSpeedMultiplier * 1.1);
        this.hideObstacles = false;
    }

    public getSpeedMultiplier(): number {
        return this.speedMultiplier;
    }

    public getLengthMultiplier(): number {
        return this.lengthMultiplier;
    }

    public getObstacleSpeedMultiplier(): number {
        return this.obstacleSpeedMultiplier;
    }

    public shouldHideObstacles(): boolean {
        return this.hideObstacles;
    }

    public getAssistMode(): boolean {
        return StorageHelper.getAssistMode();
    }

    public setAssistMode(enabled: boolean): void {
        StorageHelper.setAssistMode(enabled);
    }

    public reset(): void {
        this.jumpHistory = [];
        this.speedMultiplier = 1;
        this.lengthMultiplier = 1;
        this.obstacleSpeedMultiplier = 1;
        this.hideObstacles = false;
    }
}