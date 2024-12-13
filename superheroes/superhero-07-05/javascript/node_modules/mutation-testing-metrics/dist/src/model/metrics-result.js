import { countFileMetrics, countTestFileMetrics } from '../calculateMetrics.js';
/**
 * A metrics result of T for a directory or file
 * @type {TFile} Either a file under test, or a test file
 * @type {TMetrics} Either test file metrics or file under test metrics
 */
export class MetricsResult {
    /**
     * The parent of this result (if it has one)
     */
    parent;
    /**
     * The name of this result
     */
    name;
    /**
     * The file belonging to this metric result (if it represents a single file)
     */
    file;
    /**
     * The the child results
     */
    childResults;
    /**
     * The actual metrics
     */
    metrics;
    constructor(name, childResults, metrics, file) {
        this.name = name;
        this.childResults = childResults;
        this.metrics = metrics;
        this.file = file;
    }
    updateParent(value) {
        this.parent = value;
        this.childResults.forEach((result) => result.updateParent(this));
    }
    updateAllMetrics() {
        if (this.parent !== undefined) {
            this.parent.updateAllMetrics();
            return;
        }
        this.updateMetrics();
    }
    updateMetrics() {
        if (this.file === undefined) {
            this.childResults.forEach((childResult) => {
                childResult.updateMetrics();
            });
            const files = this.#getFileModelsRecursively(this.childResults);
            if (files.length === 0) {
                return;
            }
            if (files[0].tests) {
                this.metrics = countTestFileMetrics(files);
            }
            else {
                this.metrics = countFileMetrics(files);
            }
            return;
        }
        if (this.file.tests) {
            this.metrics = countTestFileMetrics([this.file]);
        }
        else {
            this.metrics = countFileMetrics([this.file]);
        }
    }
    #getFileModelsRecursively(childResults) {
        const flattenedFiles = [];
        if (childResults.length === 0) {
            return flattenedFiles;
        }
        childResults.forEach((child) => {
            if (child.file) {
                flattenedFiles.push(child.file);
                return;
            }
            flattenedFiles.push(...this.#getFileModelsRecursively(child.childResults));
        });
        return flattenedFiles;
    }
}
//# sourceMappingURL=metrics-result.js.map