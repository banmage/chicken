import { LevelStats } from '../data/types';

export class GameUI extends Laya.Sprite {
    private levelText!: Laya.Text;
    private timeText!: Laya.Text;
    private deathText!: Laya.Text;
    private pauseButton!: Laya.Button;

    constructor() {
        super();
        this.createUI();
    }

    private createUI(): void {
        this.levelText = new Laya.Text();
        this.levelText.text = '关卡: 1';
        this.levelText.fontSize = 20;
        this.levelText.color = '#FFF';
        this.levelText.pos(20, 20);
        this.levelText.stroke = 2;
        this.levelText.strokeColor = '#000';
        this.addChild(this.levelText);

        this.timeText = new Laya.Text();
        this.timeText.text = '时间: 0:00';
        this.timeText.fontSize = 20;
        this.timeText.color = '#FFF';
        this.timeText.pos(120, 20);
        this.timeText.stroke = 2;
        this.timeText.strokeColor = '#000';
        this.addChild(this.timeText);

        this.deathText = new Laya.Text();
        this.deathText.text = '死亡: 0';
        this.deathText.fontSize = 20;
        this.deathText.color = '#FF4444';
        this.deathText.pos(220, 20);
        this.deathText.stroke = 2;
        this.deathText.strokeColor = '#000';
        this.addChild(this.deathText);

        this.pauseButton = new Laya.Button();
        this.pauseButton.label = '暂停';
        this.pauseButton.fontSize = 16;
        this.pauseButton.size(80, 30);
        this.pauseButton.pos(900, 20);
        this.pauseButton.on(Laya.Event.CLICK, this, this.onPauseClick);
        this.addChild(this.pauseButton);
    }

    public updateStats(stats: LevelStats): void {
        const minutes = Math.floor(stats.elapsedTime / 60000);
        const seconds = Math.floor((stats.elapsedTime % 60000) / 1000);
        this.timeText.text = `时间: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.deathText.text = `死亡: ${stats.deathCount}`;
    }

    public setLevel(level: number): void {
        this.levelText.text = `关卡: ${level}`;
    }

    private onPauseClick(): void {
        this.event('pause');
    }

    public destroy(): void {
        this.pauseButton.offAll();
        super.destroy();
    }
}