import { STORAGE_KEYS, SaveData } from '../data/types';

export class StorageHelper {
    private static defaultSaveData: SaveData = {
        highestLevel: 1,
        stars: {},
        achievements: [],
        assistMode: false,
        dailyBestTime: {},
        skins: []
    };

    public static getSaveData(): SaveData {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.HIGHEST_LEVEL);
            if (!data) {
                return this.defaultSaveData;
            }
            return JSON.parse(data);
        } catch {
            return this.defaultSaveData;
        }
    }

    public static saveData(data: SaveData): void {
        try {
            Laya.LocalStorage.setItem(STORAGE_KEYS.HIGHEST_LEVEL, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save data:', e);
        }
    }

    public static getHighestLevel(): number {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.HIGHEST_LEVEL);
            if (!data) return 1;
            const saveData = JSON.parse(data) as SaveData;
            return saveData.highestLevel || 1;
        } catch {
            return 1;
        }
    }

    public static setHighestLevel(level: number): void {
        const data = this.getSaveData();
        if (level > data.highestLevel) {
            data.highestLevel = level;
            this.saveData(data);
        }
    }

    public static getStars(level: number): number {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.STARS);
            if (!data) return 0;
            const stars = JSON.parse(data) as Record<number, number>;
            return stars[level] || 0;
        } catch {
            return 0;
        }
    }

    public static setStars(level: number, stars: number): void {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.STARS);
            const starsData = data ? JSON.parse(data) as Record<number, number> : {};
            if (!starsData[level] || stars > starsData[level]) {
                starsData[level] = stars;
                Laya.LocalStorage.setItem(STORAGE_KEYS.STARS, JSON.stringify(starsData));
            }
        } catch (e) {
            console.error('Failed to save stars:', e);
        }
    }

    public static getAssistMode(): boolean {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.ASSIST_MODE);
            return data === 'true';
        } catch {
            return false;
        }
    }

    public static setAssistMode(enabled: boolean): void {
        try {
            Laya.LocalStorage.setItem(STORAGE_KEYS.ASSIST_MODE, enabled.toString());
        } catch (e) {
            console.error('Failed to save assist mode:', e);
        }
    }

    public static getDailyBestTime(dateStr: string): number {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.DAILY_RECORD);
            if (!data) return 0;
            const records = JSON.parse(data) as Record<string, number>;
            return records[dateStr] || 0;
        } catch {
            return 0;
        }
    }

    public static setDailyBestTime(dateStr: string, time: number): void {
        try {
            const data = Laya.LocalStorage.getItem(STORAGE_KEYS.DAILY_RECORD);
            const records = data ? JSON.parse(data) as Record<string, number> : {};
            if (!records[dateStr] || time < records[dateStr]) {
                records[dateStr] = time;
                Laya.LocalStorage.setItem(STORAGE_KEYS.DAILY_RECORD, JSON.stringify(records));
            }
        } catch (e) {
            console.error('Failed to save daily record:', e);
        }
    }
}