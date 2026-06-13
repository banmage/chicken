export class PausePopup extends Laya.Sprite {
    private resumeButton!: Laya.Button;
    private menuButton!: Laya.Button;

    constructor() {
        super();
        this.createUI();
    }

    private createUI(): void {
        this.graphics.drawRect(0, 0, 1000, 600, 'rgba(0,0,0,0.7)');

        const panel = new Laya.Sprite();
        panel.pos(350, 200);
        panel.graphics.drawRect(0, 0, 300, 200, '#FFF');
        panel.graphics.drawRect(5, 5, 290, 190, '#EEE');
        this.addChild(panel);

        const title = new Laya.Text();
        title.text = '游戏暂停';
        title.fontSize = 32;
        title.color = '#333';
        title.bold = true;
        title.pos(80, 30);
        panel.addChild(title);

        this.resumeButton = new Laya.Button();
        this.resumeButton.label = '继续游戏';
        this.resumeButton.fontSize = 20;
        this.resumeButton.size(180, 40);
        this.resumeButton.pos(60, 100);
        this.resumeButton.on(Laya.Event.CLICK, this, this.onResumeClick);
        panel.addChild(this.resumeButton);

        this.menuButton = new Laya.Button();
        this.menuButton.label = '返回菜单';
        this.menuButton.fontSize = 20;
        this.menuButton.size(180, 40);
        this.menuButton.pos(60, 150);
        this.menuButton.on(Laya.Event.CLICK, this, this.onMenuClick);
        panel.addChild(this.menuButton);
    }

    private onResumeClick(): void {
        this.event('resume');
    }

    private onMenuClick(): void {
        this.event('menu');
    }

    public destroy(): void {
        this.resumeButton.offAll();
        this.menuButton.offAll();
        super.destroy();
    }
}