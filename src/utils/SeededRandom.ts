export class SeededRandom {
    private seed: number;

    constructor(seed: number | string) {
        if (typeof seed === 'string') {
            this.seed = this.stringToSeed(seed);
        } else {
            this.seed = seed;
        }
    }

    private stringToSeed(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    public next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    public nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    public nextFloat(min: number = 0, max: number = 1): number {
        return this.next() * (max - min) + min;
    }

    public shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    public static createDailySeed(): SeededRandom {
        const dateStr = new Date().toDateString();
        return new SeededRandom(dateStr);
    }
}