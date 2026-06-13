export enum GameState {
    Menu = "Menu",
    Loading = "Loading",
    Playing = "Playing",
    Paused = "Paused",
    Win = "Win",
    Lose = "Lose"
}

export interface LevelConfig {
    id: number;
    lanes: number;
    boatsPerLane: number;
    boatSpeed: number;
    boatLength: number;
    obstacles: number;
}

export interface LevelsData {
    levels: LevelConfig[];
}

export interface LevelStats {
    elapsedTime: number;
    deathCount: number;
    jumpCount: number;
    successfulJumpCount: number;
}

export interface SaveData {
    highestLevel: number;
    stars: Record<number, number>;
    achievements: string[];
    assistMode: boolean;
    dailyBestTime: Record<string, number>;
    skins: string[];
}

export interface Position {
    x: number;
    y: number;
}

export interface BoatData {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    direction: number;
}

export interface ObstacleData {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    direction: number;
}

export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 600;

export const BOTTOM_BANK_Y = 520;
export const TOP_BANK_Y = 0;
export const BANK_HEIGHT = 80;

export const LANE_HEIGHT = 40;
export const LANE_GAP = 70;

export const CHICKEN_WIDTH = 40;
export const CHICKEN_HEIGHT = 40;

export const BOAT_HEIGHT = 20;

export const OBSTACLE_WIDTH = 40;
export const OBSTACLE_HEIGHT = 30;

export const JUMP_DURATION = 300;
export const SAFE_STAY_TIME = 500;

export const STORAGE_PREFIX = "CCR_";

export const STORAGE_KEYS = {
    HIGHEST_LEVEL: `${STORAGE_PREFIX}HIGHEST_LEVEL`,
    STARS: `${STORAGE_PREFIX}STARS`,
    ACHIEVEMENTS: `${STORAGE_PREFIX}ACHIEVEMENTS`,
    ASSIST_MODE: `${STORAGE_PREFIX}ASSIST_MODE`,
    DAILY_RECORD: `${STORAGE_PREFIX}DAILY_RECORD`,
    SKINS: `${STORAGE_PREFIX}SKINS`
};