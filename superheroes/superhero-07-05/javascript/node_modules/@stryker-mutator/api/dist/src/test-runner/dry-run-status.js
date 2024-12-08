export var DryRunStatus;
(function (DryRunStatus) {
    /**
     * Indicates that a test run is completed with failed or succeeded tests
     */
    DryRunStatus["Complete"] = "complete";
    /**
     * Indicates that a test run cut off early with an error
     */
    DryRunStatus["Error"] = "error";
    /**
     * Indicates that a test run timed out
     */
    DryRunStatus["Timeout"] = "timeout";
})(DryRunStatus || (DryRunStatus = {}));
//# sourceMappingURL=dry-run-status.js.map