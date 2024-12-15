import type { PropertyValues } from 'lit';
import type { FileUnderTestModel, Metrics, MetricsResult } from 'mutation-testing-metrics';
import type { Thresholds } from 'mutation-testing-report-schema/api';
import type { DrawerMode } from '../drawer/drawer.component.js';
import { RealTimeElement } from '../real-time-element.js';
export declare class MutationTestReportMutantViewComponent extends RealTimeElement {
    drawerMode: DrawerMode;
    private selectedMutant?;
    static styles: import("lit").CSSResult[];
    result: MetricsResult<FileUnderTestModel, Metrics>;
    thresholds: Thresholds;
    path: string[];
    constructor();
    private handleClick;
    private handleMutantSelected;
    updated(changes: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=mutant-view.d.ts.map