import { LevelStats } from '../data/types';

export class WinPopup extends Laya.Sprite {
    private stars: Laya.Sprite[] = [];
    private nextButton!: Laya.Button;
    private retryButton!: Laya.Button;
    private menuButton!: Laya.Button;
    private timeText!: Laya.Text;

    constructor() {
        super();
        this.createUI();
    }

    private createUI(): void {
        this.graphics.drawRect(0, 0, 1000, 600, 'rgba(0,0,0,0.7)');

        const panel = new Laya.Sprite();
        panel.pos(300, 150);
        panel.graphics.drawRect(0, 0, 400, 300, '#FFF');
        panel.graphics.drawRect(5, 5, 390, 290, '#EEE');
        this.addChild(panel);

        const title = new Laya.Text();
        title.text = '胜利!';
        title.fontSize = 36;
        title.color = '#FFD700';
        title.bold = true;
        title.pos(150, 30);
        panel.addChild(title);

        for (let i = 0; i < 3; i++) {
            const star = new Laya.Sprite();
            star.pos(100 + i * 80, 100);
            star.graphics.drawPoly(20, 20, [20,0, 24,15, 40,15, 28,25, 33,40, 20,30, 7,40, 12,25, 0,15, 16,15], '#DDD');
            this.stars.push(star);
            panel.addChild(star);
        }

        this.timeText = new Laya.Text();
        this.timeText.text = '用时: 0:00';
        this.timeText.fontSize = 20;
        this.timeText.color = '#333';
        this.timeText.pos(150, 180);
        panel.addChild(this.timeText);

        this.nextButton = new Laya.Button();
        this.nextButton.label = '下一关';
        this.nextButton.fontSize = 20;
        this.nextButton.size(120, 40);
        this.nextButton.pos(140, 230);
        this.nextButton.on(Laya.Event.CLICK, this, this.onNextClick);
        panel.addChild(this.nextButton);

        this.retryButton = new Laya.Button();
        this.retryButton.label = '重试';
        this.retryButton.fontSize = 20;
        this.retryButton.size(120, 40);
        this.retryButton.pos(260, 230);
        this.retryButton.on(Laya.Event.CLICK, this, this.onRetryClick);
        panel.addChild(this.retryButton);

        this.menuButton = new Laya.Button();
        this.menuButton.label = '菜单';
        this.menuButton.fontSize = 16;
        this.menuButton.size(80, 30);
        this.menuButton.pos(160, 280);
        this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
        panel.addChild(this.menuButton);
    }

    public setStars(count: number): void {
        for (let i = 0; i < 3; i++) {
            this.stars[i].graphics.clear();
            const color = i < count ? '#FFD700' : '#DDD';
            this.stars[i].graphics.drawPoly(20, 20, [20,0, 24,15, 40,15, 28,25, 33,40, 20,30, 7,40, 12,25, 0,15, 16,15], color);
        }
    }

    public setTime(time: number): void {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        this.timeText.text = `用时: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    public setNextLevelEnabled(enabled: boolean): void {
        this.nextButton.enabled = enabled;
    }

    private onNextClick(): void {
        this.event('next');
    }

    private onRetryClick(): void {
        this.event('retry');
    }

    private onMenuClick(): void {
        this.event('menu');
    }

    public destroy(): void {
        this.nextButton.offAll();
        this.retryButton.offAll();
        this.menuButton.offAll();
        super.destroy();
    }
}