import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/app/lib/utils.js"
import { Bot, User } from 'lucide-react';
import ReactMarkdown from "react-markdown";

export function ChatMessage({ isAI, message, className }) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 transition-colors md:gap-6 md:p-6 dark:bg-gray-200 bg-neutral-950 text-gray-200 dark:text-neutral-950",
        className
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 select-none">
        {isAI ? (
          <>
            <AvatarFallback>AI</AvatarFallback>
            <Bot className="h-5 w-5 text-black dark:text-white" />
          </>
        ) : (
          <>
            <AvatarFallback>U</AvatarFallback>
            <User className="h-5 w-5 text-black dark:text-white" />
          </>
        )}
      </Avatar>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-semibold">{isAI ? "AI" : "You"}</div>
        {isAI ? (
          <ReactMarkdown className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:px-0">
            {message}
          </ReactMarkdown>
        ) : (
          <p className="leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}
