/**
 * Indicates what the result of a single test was.
 */
export var TestStatus;
(function (TestStatus) {
    /**
     * The test succeeded
     */
    TestStatus[TestStatus["Success"] = 0] = "Success";
    /**
     * The test failed
     */
    TestStatus[TestStatus["Failed"] = 1] = "Failed";
    /**
     * The test was skipped (not executed)
     */
    TestStatus[TestStatus["Skipped"] = 2] = "Skipped";
})(TestStatus || (TestStatus = {}));
//# sourceMappingURL=test-status.js.map