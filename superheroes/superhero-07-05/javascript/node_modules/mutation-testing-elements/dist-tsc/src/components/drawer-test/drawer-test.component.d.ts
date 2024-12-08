import type { TestModel } from 'mutation-testing-metrics';
import type { DrawerMode } from '../drawer/drawer.component.js';
import { RealTimeElement } from '../real-time-element.js';
export declare class MutationTestReportDrawerTestComponent extends RealTimeElement {
    test?: TestModel;
    mode: DrawerMode;
    static styles: import("lit").CSSResult[];
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    private renderSummary;
    private renderDetail;
}
//# sourceMappingURL=drawer-test.component.d.ts.map