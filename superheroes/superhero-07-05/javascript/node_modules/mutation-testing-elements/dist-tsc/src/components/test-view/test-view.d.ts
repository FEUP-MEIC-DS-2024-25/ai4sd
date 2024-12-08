import type { PropertyValues } from 'lit';
import type { MetricsResult, TestFileModel, TestMetrics } from 'mutation-testing-metrics';
import type { DrawerMode } from '../drawer/drawer.component.js';
import { RealTimeElement } from '../real-time-element.js';
export declare class MutationTestReportTestViewComponent extends RealTimeElement {
    drawerMode: DrawerMode;
    result: MetricsResult<TestFileModel, TestMetrics>;
    path: string[];
    private selectedTest?;
    static styles: import("lit").CSSResult[];
    constructor();
    private handleClick;
    private handleTestSelected;
    updated(changes: PropertyValues): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=test-view.d.ts.map