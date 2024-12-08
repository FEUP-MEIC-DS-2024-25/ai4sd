import { LitElement } from 'lit';
export declare class ResultStatusBar extends LitElement {
    #private;
    static styles: import("lit").CSSResult[];
    detected: number;
    noCoverage: number;
    pending: number;
    survived: number;
    total: number;
    private shouldBeSmall;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=result-status-bar.d.ts.map