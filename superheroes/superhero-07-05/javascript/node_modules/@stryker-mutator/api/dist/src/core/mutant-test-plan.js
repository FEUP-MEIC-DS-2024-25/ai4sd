/**
 * The test plans that belong to a mutant.
 */
export var PlanKind;
(function (PlanKind) {
    /**
     * Early result plan, mutant does not have to be checked or run.
     */
    PlanKind["EarlyResult"] = "EarlyResult";
    /**
     * Run plan, mutant will have to be checked and run.
     */
    PlanKind["Run"] = "Run";
})(PlanKind || (PlanKind = {}));
//# sourceMappingURL=mutant-test-plan.js.map