// // Assets
// import styles from "@/app/page.module.css";
// import 'bootstrap/dist/css/bootstrap.css';
// import "@/app/globals.css";

// // Components
// import NavBar from "@/app/components/navbar";
// import HeroBar from "@/app/components/heroBar";
// import FeaturedBar from "@/app/components/featuredBar";
// import AssistantList from "@/app/components/assistantList";
// import Footer from "@/app/components/footer"

// export default function Home() {
//     return (
//         <main className={styles.main} style={{ color: "none" }}>
//             <NavBar />
//             <HeroBar />
//             <FeaturedBar />
//             <AssistantList />
//             <Footer />
//         </main>
//     );
// }        

import styles from "@/app/page.module.css";
import 'bootstrap/dist/css/bootstrap.css';

import '@/app/globals.css';
import { Copy, RefreshCcw } from "lucide-react";
import { CornerDownLeft, Paperclip } from "lucide-react";

import Footer from "@/app/components/footer";
import NavBar from "@/app/components/navbar";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from './AI_assistant/components/chat/chat-bubble'
import { ChatMessageList } from './AI_assistant/components/chat/chat-message-list'
import { Button } from "./AI_assistant/components/ui/button";
import { ChatInput } from "./AI_assistant/components/chat/chat-input";

const messages = [
  {
    id: 1,
    message: 'Help me with my essay.',
    sender: 'user',
  },
  {
    id: 2,
    message: 'I can help you with that. What do you need help with?',
    sender: 'bot',
  },
];

const actionIcons = [
  { icon: Copy, type: 'Copy' },
  { icon: RefreshCcw, type: 'Regenerate' },
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





export default function AI_assistant() {

    const assistName = "AI_assitant"
    const assitType = "verif"

    return (
        <main className={styles.main} style={{ color: "white" }}>
            <NavBar />

          
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


  
<form className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1">
      <ChatInput
        placeholder="Type your message here..."
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        <Button variant="ghost" size="icon">
          <Paperclip className="size-4" />
          <span className="sr-only">Attach file</span>
        </Button>


        <Button size="sm" className="ml-auto gap-1.5">
          Send Message
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
            
            <Footer />
        </main>
    );

}