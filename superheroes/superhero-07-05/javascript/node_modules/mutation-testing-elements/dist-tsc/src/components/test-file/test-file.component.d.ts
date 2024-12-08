import type { PropertyValues } from 'lit';
import type { TestFileModel } from 'mutation-testing-metrics';
import { TestStatus } from 'mutation-testing-metrics';
import '../../style/prism-plugins';
import { RealTimeElement } from '../real-time-element.js';
export declare class TestFileComponent extends RealTimeElement {
    static styles: import("lit").CSSResult[];
    model: TestFileModel | undefined;
    private filters;
    private lines;
    enabledStates: TestStatus[];
    private selectedTest;
    private tests;
    constructor();
    private readonly filtersChanged;
    private toggleTest;
    private readonly nextTest;
    private readonly previousTest;
    private selectTest;
    render(): import("lit-html").TemplateResult<1>;
    private renderTestList;
    private renderCode;
    private renderTestDots;
    reactivate(): void;
    willUpdate(changes: PropertyValues<TestFileComponent>): void;
    private updateFileRepresentation;
}
//# sourceMappingURL=test-file.component.d.ts.map