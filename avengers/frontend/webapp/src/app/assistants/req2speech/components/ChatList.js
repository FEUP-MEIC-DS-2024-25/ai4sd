import { ChatMessage } from "./ChatMessage";

export function ChatList({ conversations }) {
    return (
      <div className="flex flex-col divide-y divide-border rounded-lg border">
        {conversations.map((conv, index) => (
          <div key={index}>
            <ChatMessage message={conv.query} />
            <ChatMessage isAI message={conv.answer} />
          </div>
        ))}
      </div>
    )
  }
  
  