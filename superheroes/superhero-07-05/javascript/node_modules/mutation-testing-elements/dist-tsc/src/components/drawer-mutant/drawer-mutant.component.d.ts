import type { TemplateResult } from 'lit';
import type { MutantModel } from 'mutation-testing-metrics';
import type { DrawerMode } from '../drawer/drawer.component.js';
import { RealTimeElement } from '../real-time-element.js';
export declare class MutationTestReportDrawerMutant extends RealTimeElement {
    mutant?: MutantModel;
    mode: DrawerMode;
    static styles: import("lit").CSSResult[];
    constructor();
    render(): TemplateResult<1>;
    private renderSummary;
    private renderDetail;
}
//# sourceMappingURL=drawer-mutant.component.d.ts.map