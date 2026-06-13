import { GAME_WIDTH, BOAT_HEIGHT } from '../data/types';
import { DifficultyManager } from '../managers/DifficultyManager';

export class Boat extends Laya.Sprite {
    private speed: number;
    private direction: number;
    private width: number;
    private laneY: number;

    constructor(x: number, y: number, width: number, speed: number, direction: number) {
        super();
        this.width = width;
        this.speed = speed;
        this.direction = direction;
        this.laneY = y;
        this.pos(x, y);
        this.createView();
    }

    private createView(): void {
        this.graphics.clear();
        this.graphics.drawRect(0, 0, this.width, BOAT_HEIGHT, '#8B4513');
        this.graphics.drawRect(5, 5, this.width - 10, BOAT_HEIGHT - 10, '#A0522D');
        this.size(this.width, BOAT_HEIGHT);
    }

    public update(): void {
        const difficulty = DifficultyManager.getInstance();
        const actualSpeed = this.speed * difficulty.getSpeedMultiplier();
        this.x += this.direction * actualSpeed;

        if (this.x + this.width < 0) {
            this.x = GAME_WIDTH;
        } else if (this.x > GAME_WIDTH) {
            this.x = -this.width;
        }
    }

    public getRight(): number {
        return this.x + this.width;
    }

    public getCenterX(): number {
        return this.x + this.width / 2;
    }

    public getLaneY(): number {
        return this.laneY;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(width: number): void {
        this.width = width;
        this.createView();
    }

    public containsPoint(x: number): boolean {
        return x >= this.x && x <= this.x + this.width;
    }

    public destroy(): void {
        super.destroy();
    }
}