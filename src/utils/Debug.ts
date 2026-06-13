export class Debug {
    private static enabled: boolean = true;

    public static setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    public static log(...args: unknown[]): void {
        if (this.enabled) {
            console.log('[DEBUG]', ...args);
        }
    }

    public static warn(...args: unknown[]): void {
        if (this.enabled) {
            console.warn('[DEBUG]', ...args);
        }
    }

    public static error(...args: unknown[]): void {
        console.error('[DEBUG]', ...args);
    }

    public static assert(condition: boolean, message: string): void {
        if (!condition) {
            console.error('[ASSERT]', message);
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    public static time(label: string): void {
        if (this.enabled) {
            console.time(label);
        }
    }

    public static timeEnd(label: string): void {
        if (this.enabled) {
            console.timeEnd(label);
        }
    }
}