import AssistantButton from "./assistantButton"
import Assistant from "./assistant"

export default function AssistantList() {
    return (<div className="container" style={{ backgroundColor: "#EFEFEF", minWidth: "100%", minHeight: "650px" }}>
        <div className="row" style={{marginTop: "30px", marginBottom: "15px", display: "grid", placeContent: "center"}}>
            <span style={{ color: "#636363", fontSize: "16px", fontVariant: "small-caps", margin: "0px" }}>Filter</span>
        </div>
        <div className="row" id="filterControls" style={{marginBottom: "65px", display: "grid", gridTemplateColumns: "repeat(4, 165px)", gap: "15px", alignContent: "center", justifyContent: "center" }}>
            <AssistantButton area="arch"></AssistantButton>
            <AssistantButton area="refact"></AssistantButton>
            <AssistantButton area="req"></AssistantButton>
            <AssistantButton area="verif"></AssistantButton>
        </div>
        <div className="container" style={{ display: "grid", gap: "65px", gridTemplateColumns: "repeat(3, 1fr)", padding: "30px"}}>
            <Assistant name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
            <Assistant name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
            <Assistant name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
            <Assistant name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
            <Assistant name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
            <Assistant name="Archy" teamId="1MEIC01T2" description="Analyze local data such as commit logs and  documentation in software repositories and infer which patterns are present in source code." area="arch" />
        </div>
    </div>)
}