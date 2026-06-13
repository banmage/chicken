import { StorageHelper } from '../utils/StorageHelper';

export enum AchievementType {
    FIRST_WIN = 'FIRST_WIN',
    PERFECT_WIN = 'PERFECT_WIN',
    FAST_WIN = 'FAST_WIN',
    NO_DEATH = 'NO_DEATH',
    LEVEL_5 = 'LEVEL_5',
    LEVEL_10 = 'LEVEL_10',
    DAILY_CHALLENGE = 'DAILY_CHALLENGE'
}

export interface Achievement {
    id: AchievementType;
    name: string;
    description: string;
    unlocked: boolean;
}

export class AchievementManager {
    private static instance: AchievementManager;
    private achievements: Achievement[] = [
        { id: AchievementType.FIRST_WIN, name: '初次胜利', description: '完成第一关', unlocked: false },
        { id: AchievementType.PERFECT_WIN, name: '完美通关', description: '获得三星评价', unlocked: false },
        { id: AchievementType.FAST_WIN, name: '极速通关', description: '30秒内通关', unlocked: false },
        { id: AchievementType.NO_DEATH, name: '零死亡', description: '一局内零死亡通关', unlocked: false },
        { id: AchievementType.LEVEL_5, name: '第五关', description: '通过第五关', unlocked: false },
        { id: AchievementType.LEVEL_10, name: '最终挑战', description: '通过第十关', unlocked: false },
        { id: AchievementType.DAILY_CHALLENGE, name: '每日挑战', description: '完成每日挑战', unlocked: false }
    ];

    private constructor() {
        this.loadUnlocked();
    }

    public static getInstance(): AchievementManager {
        if (!AchievementManager.instance) {
            AchievementManager.instance = new AchievementManager();
        }
        return AchievementManager.instance;
    }

    private loadUnlocked(): void {
        try {
            const data = Laya.LocalStorage.getItem('CCR_ACHIEVEMENTS');
            if (data) {
                const unlocked = JSON.parse(data) as string[];
                this.achievements.forEach(ach => {
                    ach.unlocked = unlocked.includes(ach.id);
                });
            }
        } catch {
            // ignore
        }
    }

    private saveUnlocked(): void {
        const unlocked = this.achievements.filter(ach => ach.unlocked).map(ach => ach.id);
        Laya.LocalStorage.setItem('CCR_ACHIEVEMENTS', JSON.stringify(unlocked));
    }

    public unlock(id: AchievementType): boolean {
        const achievement = this.achievements.find(ach => ach.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.saveUnlocked();
            return true;
        }
        return false;
    }

    public isUnlocked(id: AchievementType): boolean {
        const achievement = this.achievements.find(ach => ach.id === id);
        return achievement ? achievement.unlocked : false;
    }

    public getAllAchievements(): Achievement[] {
        return [...this.achievements];
    }

    public getUnlockedCount(): number {
        return this.achievements.filter(ach => ach.unlocked).length;
    }
}