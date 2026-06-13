export class CollisionHelper {
    public static rectIntersect(
        x1: number, y1: number, w1: number, h1: number,
        x2: number, y2: number, w2: number, h2: number
    ): boolean {
        return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
    }

    public static pointInRect(
        px: number, py: number,
        rx: number, ry: number, rw: number, rh: number
    ): boolean {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }

    public static pointInRange(px: number, min: number, max: number): boolean {
        return px >= min && px <= max;
    }

    public static closestPointOnLine(
        px: number, py: number,
        x1: number, y1: number, x2: number, y2: number
    ): { x: number; y: number } {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
        return {
            x: x1 + t * dx,
            y: y1 + t * dy
        };
    }

    public static distance(
        x1: number, y1: number,
        x2: number, y2: number
    ): number {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}