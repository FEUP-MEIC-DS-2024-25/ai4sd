import { IssuesListScreenProps } from "../utilities/types";

function IssuesListPage({issues, setSelectedIssue} : IssuesListScreenProps): React.JSX.Element {
    
    return(
        <div>
            <ul
                style={{
                listStyle: "none",
                padding: 0,
                marginTop: "0px",
                }}
            >
                {issues.map((issue) => (
                <li
                    key={issue.number}
                    onClick={() => {
                        setSelectedIssue(issue);
                    }}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    }}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 21 21"
                    style={{
                        marginRight: "7px",
                        width: "16px",
                        height: "16px",
                        flexShrink: 0,
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
                        opacity: 0.9,
                    }}
                    >
                    {issue.number} | {issue.title}
                    </strong>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default IssuesListPage