import { GameMain } from './game/GameMain';
import { LevelManager } from './managers/LevelManager';
import { Debug } from './utils/Debug';

declare const LevelsData: { levels: { id: number; lanes: number; boatsPerLane: number; boatSpeed: number; boatLength: number; obstacles: number }[] };

export class Main {
    constructor() {
        Laya.init(1000, 600, Laya.WebGL);
        Laya.stage.scaleMode = 'exactFit';
        Laya.stage.screenMode = 'horizontal';
        Laya.stage.alignV = 'middle';
        Laya.stage.alignH = 'center';

        Debug.setEnabled(true);
        Debug.log('Game initializing...');

        this.loadLevels().then(() => {
            this.startGame();
        }).catch(err => {
            Debug.error('Failed to load levels:', err);
        });
    }

    private async loadLevels(): Promise<void> {
        return new Promise((resolve, reject) => {
            Laya.loader.load('src/config/Levels.json', Laya.Handler.create(this, (data: unknown) => {
                try {
                    const levelsData = data as { levels: { id: number; lanes: number; boatsPerLane: number; boatSpeed: number; boatLength: number; obstacles: number }[] };
                    LevelManager.getInstance().loadLevels(levelsData);
                    Debug.log('Levels loaded successfully');
                    resolve();
                } catch (e) {
                    reject(e);
                }
            }), null, Laya.Loader.JSON);
        });
    }

    private startGame(): void {
        const gameMain = new GameMain();
        Laya.stage.addChild(gameMain);
        Debug.log('Game started');
    }
}

new Main();