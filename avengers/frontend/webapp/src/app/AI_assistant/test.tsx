import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from './chat/chat-bubble'
import { ChatMessageList } from 'AI_assistant/components/chat/chat-message-list'

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

<ChatMessageList>
  {messages.map((message, index) => {
    const variant = message.sender === 'user' ? 'sent' : 'received';
    return (
      <ChatBubble key={message.id} variant={variant}>
        <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
        <ChatBubbleMessage isLoading={message.isLoading}>
          {message.message}
        </ChatBubbleMessage>
        {/* Action Icons */}
        <ChatBubbleActionWrapper>
          {actionIcons.map(({ icon: Icon, type }) => (
            <ChatBubbleAction
              className="size-7"
              key={type}
              icon={<Icon className="size-4" />}
              onClick={() => console.log('Action ' + type + ' clicked for message ' + index)}
            />
          ))}
        </ChatBubbleActionWrapper>
      </ChatBubble>
    )
  })}
</ChatMessageList>
