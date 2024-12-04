import { AnimatePresence, motion } from "framer-motion";
import {
    ChatBubble,
    ChatBubbleAction,
    ChatBubbleAvatar,
    ChatBubbleMessage,
  } from "@/app/components/ui/shad/chat/chat-bubble";
  import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/shad/avatar";
  import {
    CopyIcon,
    CornerDownLeft,
    Mic,
    Paperclip,
    RefreshCcw,
    Volume2,
  } from "lucide-react";

  const ChatAiIcons = [
    {
      icon: CopyIcon,
      label: "Copy",
    },
    {
      icon: RefreshCcw,
      label: "Refresh",
    },
    {
      icon: Volume2,
      label: "Volume",
    },
  ];

export const ChatMessage = ({index, message, variant, isLoading }) => {
  return (
         <motion.div
          key={index}
          layout
          initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
          transition={{
            opacity: { duration: 0.1 },
            layout: {
              type: "spring",
              bounce: 0.3,
              duration: index * 0.05 + 0.2,
            },
          }}
          style={{ originX: 0.5, originY: 0.5 }}
          className="flex flex-col gap-2 p-4"
        >
          <ChatBubble key={index} variant={variant}>
            <Avatar>
              <AvatarImage
                src={message.role === "ai" ? "" : "https://api.dicebear.com/9.x/pixel-art/svg"}
                alt="Avatar"
                className={message.role === "ai" ? "dark:invert" : ""}
              />
              <AvatarFallback>
                {message.role === "ai" ? "🤖" : "GG"}
              </AvatarFallback>
            </Avatar>
            <ChatBubbleMessage isLoading={isLoading}>
              {message.message}
              {/*message.role === "ai" && (
                <div className="flex items-center mt-1.5 gap-1">
                  {!isLoading && (
                    <>
                      {ChatAiIcons.map((icon, index) => {
                        const Icon = icon.icon;
                        return (
                          <ChatBubbleAction
                            variant="outline"
                            className="size-6"
                            key={index}
                            icon={<Icon className="size-3" />}
                            onClick={() =>
                              console.log(
                                "Action " +
                                  icon.label +
                                  " clicked for message " +
                                  index,
                              )
                            }
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              )*/}
            </ChatBubbleMessage>
          </ChatBubble>
        </motion.div>
  );
};