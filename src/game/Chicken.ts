import {
    GAME_WIDTH, GAME_HEIGHT, CHICKEN_WIDTH, CHICKEN_HEIGHT,
    BOTTOM_BANK_Y, BANK_HEIGHT, TOP_BANK_Y, JUMP_DURATION, SAFE_STAY_TIME
} from '../data/types';
import { Boat } from './Boat';
import { Obstacle } from './Obstacle';

export class Chicken extends Laya.Sprite {
    public static readonly MOVE_SPEED = 5;

    private isJumping: boolean = false;
    private isOnBoat: boolean = false;
    private currentBoat: Boat | null = null;
    private lastSafeBoat: Boat | null = null;
    private safeStayTimer: number = 0;
    private isOnBank: boolean = true;

    constructor() {
        super();
        this.pos(GAME_WIDTH / 2 - CHICKEN_WIDTH / 2, GAME_HEIGHT - CHICKEN_HEIGHT - 20);
        this.createView();
    }

    private createView(): void {
        this.graphics.clear();
        this.graphics.drawCircle(CHICKEN_WIDTH / 2, CHICKEN_HEIGHT / 2, CHICKEN_WIDTH / 2, '#FFD700');
        this.graphics.drawCircle(CHICKEN_WIDTH / 3, CHICKEN_HEIGHT / 3, 5, '#000');
        this.graphics.drawCircle(CHICKEN_WIDTH * 2 / 3, CHICKEN_HEIGHT / 3, 5, '#000');
        this.graphics.drawArc(CHICKEN_WIDTH / 2, CHICKEN_HEIGHT / 2, 8, 0.2, Math.PI - 0.2, false);
        this.graphics.stroke(1, '#000');
        this.size(CHICKEN_WIDTH, CHICKEN_HEIGHT);
    }

    public moveLeft(): void {
        if (!this.isJumping) {
            const newX = this.x - Chicken.MOVE_SPEED;
            if (this.isOnBoat && this.currentBoat) {
                this.x = Math.max(this.currentBoat.x, newX);
            } else {
                this.x = Math.max(0, newX);
            }
        }
    }

    public moveRight(): void {
        if (!this.isJumping) {
            const newX = this.x + Chicken.MOVE_SPEED;
            const maxX = GAME_WIDTH - CHICKEN_WIDTH;
            if (this.isOnBoat && this.currentBoat) {
                this.x = Math.min(this.currentBoat.getRight() - CHICKEN_WIDTH, newX);
            } else {
                this.x = Math.min(maxX, newX);
            }
        }
    }

    public jump(targetY: number, targetBoat: Boat | null): void {
        if (this.isJumping) return;

        this.isJumping = true;
        this.isOnBoat = false;
        this.currentBoat = null;

        const startY = this.y;
        const endY = targetY;
        const duration = JUMP_DURATION;

        Laya.Tween.to(this, { y: endY }, duration, Laya.Ease.quadInOut, Laya.Handler.create(this, () => {
            this.isJumping = false;
            this.currentBoat = targetBoat;
            this.isOnBoat = targetBoat !== null;
            this.isOnBank = this.checkOnBank();
            this.safeStayTimer = 0;
        }));
    }

    public update(dt: number): void {
        if (this.isOnBoat && this.currentBoat) {
            this.safeStayTimer += dt;
            if (this.safeStayTimer >= SAFE_STAY_TIME && this.lastSafeBoat !== this.currentBoat) {
                this.lastSafeBoat = this.currentBoat;
            }
        }
    }

    public checkOnBank(): boolean {
        return this.y >= BOTTOM_BANK_Y || this.y <= TOP_BANK_Y + BANK_HEIGHT;
    }

    public isOnTopBank(): boolean {
        return this.y <= TOP_BANK_Y + BANK_HEIGHT;
    }

    public getCenterX(): number {
        return this.x + CHICKEN_WIDTH / 2;
    }

    public getCenterY(): number {
        return this.y + CHICKEN_HEIGHT / 2;
    }

    public getBounds(): { x: number; y: number; width: number; height: number } {
        return {
            x: this.x,
            y: this.y,
            width: CHICKEN_WIDTH,
            height: CHICKEN_HEIGHT
        };
    }

    public checkObstacleCollision(obstacles: Obstacle[]): boolean {
        const bounds = this.getBounds();
        for (const obstacle of obstacles) {
            const obsBounds = obstacle.getBounds();
            if (
                bounds.x < obsBounds.x + obsBounds.width &&
                bounds.x + bounds.width > obsBounds.x &&
                bounds.y < obsBounds.y + obsBounds.height &&
                bounds.y + bounds.height > obsBounds.y
            ) {
                return true;
            }
        }
        return false;
    }

    public respawnToLastSafe(): void {
        if (this.lastSafeBoat) {
            Laya.Tween.clearAll(this);
            this.isJumping = false;
            this.y = this.lastSafeBoat.getLaneY() - CHICKEN_HEIGHT / 2;
            this.x = this.lastSafeBoat.getCenterX() - CHICKEN_WIDTH / 2;
            this.currentBoat = this.lastSafeBoat;
            this.isOnBoat = true;
            this.isOnBank = false;
        } else {
            this.respawnToStart();
        }
    }

    public respawnToStart(): void {
        Laya.Tween.clearAll(this);
        this.isJumping = false;
        this.isOnBoat = false;
        this.currentBoat = null;
        this.lastSafeBoat = null;
        this.x = GAME_WIDTH / 2 - CHICKEN_WIDTH / 2;
        this.y = GAME_HEIGHT - CHICKEN_HEIGHT - 20;
        this.isOnBank = true;
        this.safeStayTimer = 0;
    }

    public isJumpingState(): boolean {
        return this.isJumping;
    }

    public isOnBoatState(): boolean {
        return this.isOnBoat;
    }

    public isOnBankState(): boolean {
        return this.isOnBank;
    }

    public getCurrentBoat(): Boat | null {
        return this.currentBoat;
    }

    public destroy(): void {
        Laya.Tween.clearAll(this);
        super.destroy();
    }
}