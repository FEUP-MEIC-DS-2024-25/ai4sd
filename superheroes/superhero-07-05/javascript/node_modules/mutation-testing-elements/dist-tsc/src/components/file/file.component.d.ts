import type { PropertyValues } from 'lit';
import type { FileUnderTestModel, MutantModel } from 'mutation-testing-metrics';
import type { MutantStatus } from 'mutation-testing-report-schema/api';
import type { StateFilter } from '../state-filter/state-filter.component.js';
import { RealTimeElement } from '../real-time-element.js';
export declare class FileComponent extends RealTimeElement {
    static styles: import("lit").CSSResult[];
    filters: StateFilter<MutantStatus>[];
    model: FileUnderTestModel;
    selectedMutantStates: MutantStatus[];
    private selectedMutant?;
    private lines;
    mutants: MutantModel[];
    private codeRef;
    constructor();
    private readonly filtersChanged;
    private codeClicked;
    render(): import("lit-html").TemplateResult<1>;
    private nextMutant;
    private previousMutant;
    private renderMutantDots;
    private toggleMutant;
    private removeCurrentDiff;
    reactivate(): void;
    update(changes: PropertyValues<FileComponent>): void;
    private updateFileRepresentation;
    private selectedMutantsHaveChanged;
    private highlightedReplacementRows;
}
//# sourceMappingURL=file.component.d.ts.map