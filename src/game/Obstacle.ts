import { GAME_WIDTH, OBSTACLE_WIDTH, OBSTACLE_HEIGHT } from '../data/types';
import { DifficultyManager } from '../managers/DifficultyManager';

export class Obstacle extends Laya.Sprite {
    private speed: number;
    private direction: number;
    private laneY: number;

    constructor(x: number, y: number, speed: number, direction: number) {
        super();
        this.speed = speed;
        this.direction = direction;
        this.laneY = y;
        this.pos(x, y);
        this.createView();
    }

    private createView(): void {
        this.graphics.clear();
        this.graphics.drawEllipse(OBSTACLE_WIDTH / 2, OBSTACLE_HEIGHT / 2, OBSTACLE_WIDTH / 2, OBSTACLE_HEIGHT / 2, '#228B22');
        this.graphics.drawCircle(OBSTACLE_WIDTH / 2, OBSTACLE_HEIGHT / 3, 8, '#006400');
        this.size(OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    }

    public update(): void {
        const difficulty = DifficultyManager.getInstance();
        const actualSpeed = this.speed * difficulty.getObstacleSpeedMultiplier();
        this.x += this.direction * actualSpeed;

        if (this.x + OBSTACLE_WIDTH < 0) {
            this.x = GAME_WIDTH;
        } else if (this.x > GAME_WIDTH) {
            this.x = -OBSTACLE_WIDTH;
        }
    }

    public getLaneY(): number {
        return this.laneY;
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x,
            y: this.y,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT
        };
    }

    public destroy(): void {
        super.destroy();
    }
}