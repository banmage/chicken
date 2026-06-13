declare namespace Laya {
    interface StageConfig {
        designWidth?: number;
        designHeight?: number;
        scaleMode?: string;
        screenMode?: string;
        alignV?: string;
        alignH?: string;
        backgroundColor?: string;
    }

    class Sprite {
        graphics: Graphics;
        constructor();
        pos(x: number, y: number): Sprite;
        size(width: number, height: number): Sprite;
        addChild(child: Sprite): Sprite;
        removeChild(child: Sprite): Sprite;
        destroy(): void;
        on(event: string, caller: unknown, listener: (...args: unknown[]) => void): Sprite;
        off(event: string, caller: unknown, listener: (...args: unknown[]) => void): Sprite;
        offAll(event?: string): Sprite;
        event(event: string, ...args: unknown[]): void;
        getChildAt(index: number): Sprite;
        numChildren: number;
        x: number;
        y: number;
        visible: boolean;
    }

    class Graphics {
        drawRect(x: number, y: number, width: number, height: number, color: string): Graphics;
        drawCircle(x: number, y: number, radius: number, color: string): Graphics;
        drawEllipse(cx: number, cy: number, rx: number, ry: number, color: string): Graphics;
        drawArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): Graphics;
        drawPoly(cx: number, cy: number, points: number[], color: string): Graphics;
        stroke(width: number, color: string): Graphics;
        clear(): Graphics;
    }

    class Text extends Sprite {
        constructor();
        text: string;
        fontSize: number;
        color: string;
        bold: boolean;
        stroke: number;
        strokeColor: string;
    }

    class Button extends Sprite {
        constructor();
        label: string;
        fontSize: number;
        size(width: number, height: number): Button;
        enabled: boolean;
        skin: string;
    }

    class Tween {
        static to(target: unknown, props: Record<string, number>, duration: number, ease?: unknown, complete?: Handler): void;
        static clearAll(target: unknown): void;
    }

    class Handler {
        static create(caller: unknown, method: (...args: unknown[]) => void): Handler;
    }

    class Ease {
        static quadInOut: unknown;
    }

    class Loader {
        static JSON: string;
        static load(url: string, complete?: Handler, progress?: Handler | null, type?: string): void;
    }

    const loader: typeof Loader;

    class LocalStorage {
        static getItem(key: string): string | null;
        static setItem(key: string, value: string): void;
    }

    class Browser {
        static now(): number;
    }

    class timer {
        static frameLoop(interval: number, caller: unknown, method: () => void): void;
        static clearAll(caller: unknown): void;
        static once(delay: number, caller: unknown, method: () => void): void;
    }

    class stage {
        static width: number;
        static height: number;
        static scaleMode: string;
        static screenMode: string;
        static alignV: string;
        static alignH: string;
        static addChild(child: Sprite): void;
        static size(width: number, height: number): void;
        static bgColor: string;
        static on(event: string, caller: unknown, listener: (e: Event) => void): void;
        static off(event: string, caller: unknown, listener: (e: Event) => void): void;
        static offAll(event?: string): void;
    }

    class Event {
        static KEY_DOWN: string;
        static KEY_UP: string;
        static CLICK: string;
        keyCode: number;
    }

    function init(config: StageConfig): Promise<void>;
    function init(width: number, height: number, renderType?: string): Promise<void>;
}