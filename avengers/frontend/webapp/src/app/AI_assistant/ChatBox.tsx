import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from './components/chat/chat-bubble'
import { ChatMessageList } from './components/chat/chat-message-list'
import { Button } from "./components/ui/button";
import { ChatInput } from "./components/chat/chat-input";


const messages = [
    {
      id: 1,
      message: 'Hello, how has your day been? I hope you are doing well.',
      sender: 'user',
    },
    {
      id: 2,
      message: 'Hi, I am doing well, thank you for asking. How can I help you today?',
      sender: 'bot',
    },
    {
      id: 3,
      message: '',
      sender: 'bot',
      isLoading: true,
    },
  ];
  
  const ChatInputExampleCode = `import { ChatInput } from "@/components/ui/chat/chat-input"
  
  <form
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
    >
      <ChatInput
        placeholder="Type your message here..."
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        <Button variant="ghost" size="icon">
          <Paperclip className="size-4" />
          <span className="sr-only">Attach file</span>
        </Button>
  
        <Button variant="ghost" size="icon">
          <Mic className="size-4" />
          <span className="sr-only">Use Microphone</span>
        </Button>
  
        <Button
          size="sm"
          className="ml-auto gap-1.5"
        >
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  `;

  //TODO: We need to get the code messages from the backend 


export function ChatBox(){


    return (

        <ChatMessageList>
        {messages.map((message,index) => {
            const variant = message.sender === 'user' ? 'sent' : 'received';
            return (

                <ChatBubble key={message.id} variant={variant}>
                    <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
                    <ChatBubbleMessage isLoading={message.isLoading}>
                        {message.message}
                    </ChatBubbleMessage>

                </ChatBubble>
            )
        })}

        </ChatMessageList>


    )

}