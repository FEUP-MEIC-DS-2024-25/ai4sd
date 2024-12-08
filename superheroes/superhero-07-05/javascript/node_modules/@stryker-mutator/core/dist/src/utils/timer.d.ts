export declare class Timer {
    private readonly now;
    private readonly start;
    private readonly markers;
    constructor(now?: () => Date);
    humanReadableElapsed(sinceMarker?: string): string;
    elapsedSeconds(sinceMarker?: string): number;
    elapsedMs(sinceMarker?: string): number;
    mark(name: string): void;
    private static humanReadableElapsedSeconds;
    private static humanReadableElapsedMinutes;
    private static formatTime;
}
//# sourceMappingURL=timer.d.ts.map