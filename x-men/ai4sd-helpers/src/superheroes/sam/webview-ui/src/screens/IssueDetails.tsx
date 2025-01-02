import { IssueDetailsScreenProps } from "../utilities/types";
import { vscode } from "../utilities/vscode";
import { useEffect, useRef, useState } from "react";
import ReactLoading from "react-loading";
import Markdown from "react-markdown";

function stripBodyHTML(html: string): string {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

function IssueDetailsPage({
  owner,
  repo,
  selectedIssue,
}: IssueDetailsScreenProps): React.JSX.Element {
  const [chat, setChat] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  const chatID = useRef(null);

  const handleMessage = async (event: MessageEvent) => {
    console.log("Got chat from sam:", event.data);
    if (event.data["id"]) chatID.current = event.data["id"];
    const content = event.data["content"];
    // remove 3 backticks from the start and end of the string
    if (content.startsWith("```")) {
      setChat((prevChat) => [
        ...prevChat,
        content.substring(3, content.length - 3),
      ]);
    } else {
      setChat((prevChat) => [...prevChat, content]);
    }
    setLoadingChat(false);
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "8px 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", opacity: 0.8 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 21 21"
            style={{
              marginRight: "7px",
              width: "16px",
              height: "16px",
              flexShrink: 0,
              opacity: 0.8,
            }}
          >
            <circle
              cx="10"
              cy="10"
              r="9"
              stroke="#8BFCA5"
              fill="none"
              strokeWidth="2"
            />
            <circle cx="10" cy="10" r="2" fill="#8BFCA5" />
          </svg>
          <strong
            style={{
              fontWeight: 500,
            }}
          >
            {selectedIssue.number} | {selectedIssue.title}
          </strong>
        </div>
        <p
          style={{
            marginTop: "14px",
            fontSize: "12px",
            opacity: 0.65,
            // TO DO : Description
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {stripBodyHTML(selectedIssue.body)}
          </pre>
        </p>
      </div>
      {chat.length == 0 && !loadingChat && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
            opacity: "0.75",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              border: "1.5px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "transparent",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: "0.85",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.color = "#8BFCA5";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "white";
            }}
            onClick={() => {
              vscode.postMessage({
                command: "chatInit",
                data: {
                  owner: owner,
                  repo: repo,
                  issue: selectedIssue!.number,
                },
              });
              setLoadingChat(true);
            }}
          >
            How can I help?
          </button>
        </div>
      )}
      {loadingChat && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
            opacity: "0.75",
          }}
        >
          <ReactLoading type={"bubbles"} height={100} width={100} />
        </div>
      )}
      {chat.length > 0 && (
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            padding: "8px 0",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {chat.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignSelf: index % 2 == 0 ? "flex-start" : "flex-end",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor:
                  index % 2 == 0
                    ? "rgba(0, 165, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.1)",
                marginBottom: "8px",
                width: "80%",
                overflowX: "scroll",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <strong
                style={{
                  fontSize: "12px",
                  opacity: 0.8,
                  marginBottom: "4px",
                }}
              >
                {index % 2 == 0 ? "Sam" : "You"}
              </strong>
              <Markdown>{message}</Markdown>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              backgroundColor: "#1D2021",
              borderRadius: "8px",
            }}
          >
            <input
              type="text"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "12px",
                border: "1px solid #ddd",
                borderRadius: "24px",
                outline: "none",
                boxSizing: "border-box",
                color: "white",
                backgroundColor: "#1D2021",
              }}
              required
            />
            <button
              style={{
                padding: "10px 20px",
                fontSize: "12px",
                border: "none",
                borderRadius: "24px",
                backgroundColor: "#1A2E1E",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => {
                vscode.postMessage({
                  command: "chat",
                  data: {
                    id: chatID.current,
                    message: message,
                  },
                });
                setChat((prevChat) => [...prevChat, message]);
                setMessage("");
              }}
            >
              <svg
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m2.72112607 2.05149449 15.35446653 7.565969c.247703.12205658.3495596.42180601.227503.66950901-.048698.0988284-.1286747.1788051-.227503.2275031l-15.3541508 7.5658134c-.24770306.1220566-.54745246.0202-.66950904-.227503-.0533719-.1083136-.06574404-.2322825-.03483109-.3490077l1.52125123-5.7446792c.05030971-.1899839.20725125-.3328751.40110728-.3651979l6.88094892-1.1473027c.0842946-.0140491.1539978-.0697032.1874987-.1453514l.018-.0601474c.0194561-.11673645-.0453599-.22804672-.1500414-.27176154l-.0554573-.01593664-6.91980045-1.15330008c-.1939323-.03232205-.35092201-.17529727-.401185-.36537116l-1.48266862-5.60684181c-.07063055-.26695681.08852333-.54062543.35548014-.61125598.11669248-.03087411.24061464-.01849152.3488909.034862z"
                  fill="#ffffff"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default IssueDetailsPage;
