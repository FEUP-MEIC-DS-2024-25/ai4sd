import { LitElement } from 'lit';
import { View } from '../lib/router.js';
export declare class MutationTestReportBreadcrumbComponent extends LitElement {
    path: string[] | undefined;
    view: View;
    static styles: import("lit").CSSResult[];
    get rootName(): string;
    render(): import("lit-html").TemplateResult<1>;
    private renderBreadcrumbItems;
    private renderActiveItem;
    private renderLink;
}
//# sourceMappingURL=breadcrumb.d.ts.map