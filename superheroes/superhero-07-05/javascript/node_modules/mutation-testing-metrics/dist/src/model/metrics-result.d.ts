import type { FileUnderTestModel } from './file-under-test-model.js';
import type { Metrics } from './metrics.js';
/**
 * A metrics result of T for a directory or file
 * @type {TFile} Either a file under test, or a test file
 * @type {TMetrics} Either test file metrics or file under test metrics
 */
export declare class MetricsResult<TFile = FileUnderTestModel, TMetrics = Metrics> {
    #private;
    /**
     * The parent of this result (if it has one)
     */
    parent: MetricsResult<TFile, TMetrics> | undefined;
    /**
     * The name of this result
     */
    name: string;
    /**
     * The file belonging to this metric result (if it represents a single file)
     */
    file?: TFile;
    /**
     * The the child results
     */
    childResults: MetricsResult<TFile, TMetrics>[];
    /**
     * The actual metrics
     */
    metrics: TMetrics;
    constructor(name: string, childResults: MetricsResult<TFile, TMetrics>[], metrics: TMetrics, file?: TFile);
    updateParent(value?: MetricsResult<TFile, TMetrics>): void;
    updateAllMetrics(): void;
    updateMetrics(): void;
}
//# sourceMappingURL=metrics-result.d.ts.map