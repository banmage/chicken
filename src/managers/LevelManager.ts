import { LevelConfig, LevelsData } from '../data/types';
import { Debug } from '../utils/Debug';

export class LevelManager {
    private static instance: LevelManager;
    private levels: LevelConfig[] = [];
    private currentLevel: number = 1;

    private constructor() {}

    public static getInstance(): LevelManager {
        if (!LevelManager.instance) {
            LevelManager.instance = new LevelManager();
        }
        return LevelManager.instance;
    }

    public loadLevels(data: LevelsData): void {
        this.levels = data.levels;
        Debug.log('Levels loaded:', this.levels.length);
    }

    public getLevelConfig(levelId: number): LevelConfig | null {
        return this.levels.find(l => l.id === levelId) || null;
    }

    public getCurrentLevelConfig(): LevelConfig | null {
        return this.getLevelConfig(this.currentLevel);
    }

    public setCurrentLevel(level: number): void {
        this.currentLevel = level;
    }

    public getCurrentLevel(): number {
        return this.currentLevel;
    }

    public getTotalLevels(): number {
        return this.levels.length;
    }

    public hasNextLevel(): boolean {
        return this.currentLevel < this.levels.length;
    }

    public nextLevel(): void {
        if (this.hasNextLevel()) {
            this.currentLevel++;
        }
    }

    public reset(): void {
        this.currentLevel = 1;
    }
}