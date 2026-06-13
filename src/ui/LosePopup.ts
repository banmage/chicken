import { DifficultyManager } from '../managers/DifficultyManager';

export class LosePopup extends Laya.Sprite {
    private retryButton!: Laya.Button;
    private menuButton!: Laya.Button;
    private respawnButton!: Laya.Button;
    private hasRespawn!: boolean;

    constructor() {
        super();
        this.hasRespawn = DifficultyManager.getInstance().getAssistMode();
        this.createUI();
    }

    private createUI(): void {
        this.graphics.drawRect(0, 0, 1000, 600, 'rgba(0,0,0,0.7)');

        const panel = new Laya.Sprite();
        panel.pos(300, 200);
        panel.graphics.drawRect(0, 0, 400, 200, '#FFF');
        panel.graphics.drawRect(5, 5, 390, 190, '#EEE');
        this.addChild(panel);

        const title = new Laya.Text();
        title.text = '游戏结束';
        title.fontSize = 36;
        title.color = '#FF4444';
        title.bold = true;
        title.pos(120, 30);
        panel.addChild(title);

        this.retryButton = new Laya.Button();
        this.retryButton.label = '重新开始';
        this.retryButton.fontSize = 20;
        this.retryButton.size(150, 40);
        this.retryButton.pos(125, 100);
        this.retryButton.on(Laya.Event.CLICK, this, this.onRetryClick);
        panel.addChild(this.retryButton);

        if (this.hasRespawn) {
            this.respawnButton = new Laya.Button();
            this.respawnButton.label = '复活';
            this.respawnButton.fontSize = 20;
            this.respawnButton.size(150, 40);
            this.respawnButton.pos(125, 150);
            this.respawnButton.on(Laya.Event.CLICK, this, this.onRespawnClick);
            panel.addChild(this.respawnButton);
        }

        this.menuButton = new Laya.Button();
        this.menuButton.label = '菜单';
        this.menuButton.fontSize = 16;
        this.menuButton.size(80, 30);
        this.menuButton.pos(280, 100);
        this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
        panel.addChild(this.menuButton);
    }

    public setRespawnCount(count: number): void {
        if (this.respawnButton) {
            this.respawnButton.enabled = count > 0;
            this.respawnButton.label = `复活 (${count})`;
        }
    }

    private onRetryClick(): void {
        this.event('retry');
    }

    private onRespawnClick(): void {
        this.event('respawn');
    }

    private onMenuClick(): void {
        this.event('menu');
    }

    public destroy(): void {
        this.retryButton.offAll();
        if (this.respawnButton) {
            this.respawnButton.offAll();
        }
        this.menuButton.offAll();
        super.destroy();
    }
}