import { LitElement } from 'lit';
export declare abstract class RealTimeElement extends LitElement {
    #private;
    shouldReactivate(): boolean;
    reactivate(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=real-time-element.d.ts.map