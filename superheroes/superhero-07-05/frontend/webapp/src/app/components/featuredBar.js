import Featured from "./featured"

export default function FeaturedBar() {
    return (<div className="container" style={{ display: "grid", gap: "15px", padding: "20px 30px 20px 30px", gridTemplateColumns: "repeat(3, 1fr)", backgroundColor: "white", height: "400px", minWidth: "100%" }}>
        <Featured name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
        <Featured name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
        <Featured name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="refact" />
    </div>)
}