import { StorageHelper } from '../utils/StorageHelper';
import { DifficultyManager } from '../managers/DifficultyManager';

export class MenuUI extends Laya.Sprite {
    private startButton!: Laya.Button;
    private assistToggle!: Laya.Button;
    private levelText!: Laya.Text;
    private assistMode!: boolean;

    constructor() {
        super();
        this.createUI();
    }

    private createUI(): void {
        this.graphics.drawRect(0, 0, 1000, 600, '#87CEEB');

        const title = new Laya.Text();
        title.text = '小鸡过河';
        title.fontSize = 48;
        title.color = '#FFD700';
        title.bold = true;
        title.pos(350, 100);
        this.addChild(title);

        const chicken = new Laya.Sprite();
        chicken.pos(480, 180);
        chicken.graphics.drawCircle(20, 20, 20, '#FFD700');
        chicken.graphics.drawCircle(13, 13, 3, '#000');
        chicken.graphics.drawCircle(27, 13, 3, '#000');
        this.addChild(chicken);

        this.startButton = new Laya.Button();
        this.startButton.label = '开始游戏';
        this.startButton.fontSize = 24;
        this.startButton.size(200, 60);
        this.startButton.pos(400, 300);
        this.startButton.on(Laya.Event.CLICK, this, this.onStartClick);
        this.addChild(this.startButton);

        this.assistMode = StorageHelper.getAssistMode();
        this.assistToggle = new Laya.Button();
        this.updateAssistToggle();
        this.assistToggle.size(150, 40);
        this.assistToggle.pos(425, 380);
        this.assistToggle.on(Laya.Event.CLICK, this, this.onAssistToggle);
        this.addChild(this.assistToggle);

        const highestLevel = StorageHelper.getHighestLevel();
        this.levelText = new Laya.Text();
        this.levelText.text = `最高关卡: ${highestLevel}`;
        this.levelText.fontSize = 20;
        this.levelText.color = '#333';
        this.levelText.pos(425, 450);
        this.addChild(this.levelText);
    }

    private onStartClick(): void {
        this.event('start');
    }

    private onAssistToggle(): void {
        this.assistMode = !this.assistMode;
        DifficultyManager.getInstance().setAssistMode(this.assistMode);
        this.updateAssistToggle();
    }

    private updateAssistToggle(): void {
        this.assistToggle.label = this.assistMode ? '辅助模式: 开' : '辅助模式: 关';
        this.assistToggle.skin = this.assistMode ? '' : '';
    }

    public updateHighestLevel(level: number): void {
        this.levelText.text = `最高关卡: ${level}`;
    }

    public destroy(): void {
        this.startButton.offAll();
        this.assistToggle.offAll();
        super.destroy();
    }
}