import type { PropertyValues, TemplateResult } from 'lit';
import { RealTimeElement } from '../real-time-element.js';
export interface StateFilter<TStatus> {
    status: TStatus;
    count: number;
    enabled: boolean;
    label: TemplateResult<1> | string;
    context: string;
}
export declare class FileStateFilterComponent<TStatus extends string> extends RealTimeElement {
    static styles: import("lit").CSSResult[];
    filters?: StateFilter<TStatus>[];
    updated(changedProperties: PropertyValues): void;
    private checkboxChanged;
    private dispatchFiltersChangedEvent;
    private readonly next;
    private readonly previous;
    render(): TemplateResult<1>;
    private bgForContext;
}
//# sourceMappingURL=state-filter.component.d.ts.map