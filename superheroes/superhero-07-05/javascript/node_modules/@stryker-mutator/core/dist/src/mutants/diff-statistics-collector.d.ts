export declare class DiffChanges {
    added: number;
    removed: number;
    toString(): string;
}
export type DiffChange = 'added' | 'removed';
export declare class DiffStatisticsCollector {
    readonly changesByFile: Map<string, DiffChanges>;
    readonly total: DiffChanges;
    count(file: string, change: DiffChange, amount?: number): void;
    createDetailedReport(): string[];
    createTotalsReport(): string;
}
//# sourceMappingURL=diff-statistics-collector.d.ts.map