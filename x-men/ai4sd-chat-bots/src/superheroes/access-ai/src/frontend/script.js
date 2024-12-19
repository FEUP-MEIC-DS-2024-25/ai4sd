const vscode = acquireVsCodeApi();

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (!message) {return;}

    addMessage(message, 'user-message', 'You');
    userInput.value = ''; // Clear the input field
    userInput.focus(); // Focus input back
    showTypingIndicator();

    vscode.postMessage({ type: 'userMessage', text: message });
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(text, className, label) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + className;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = label + ':';
    messageDiv.appendChild(labelDiv);

    const textDiv = document.createElement('div');
    textDiv.innerHTML = text;  // Use innerHTML for safe rendering
    messageDiv.appendChild(textDiv);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString().slice(0, 5);
    messageDiv.appendChild(timeDiv);

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

window.addEventListener('message', event => {
    const message = event.data;

    if (message.type === 'botMessage') {
        const typingDiv = document.querySelector('.typing-indicator');
        if (typingDiv) { typingDiv.remove(); }
        addBotMessage(message.text); // Add the bot message to the messages container
    } else if (message.type === 'sessionHistory') {
        // Restore the entire session history
        const messages = document.getElementById('messages');
        messages.innerHTML = ''; // Clear existing messages
        message.sessionHistory.forEach(msg => {
            if (msg.sender === 'user') {
                addMessage(msg.text, 'user-message', 'You');
            } else if (msg.sender === 'bot') {
                addBotMessage(msg.text);
            }
        });
    }
});


// Add the bot message and render Markdown in HTML
function addBotMessage(markdownText) {
    const messages = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';

    const labelDiv = document.createElement('div');
    labelDiv.className = 'message-label';
    labelDiv.textContent = 'Bot:';
    messageDiv.appendChild(labelDiv);

    // Convert Markdown to HTML
    const htmlContent = marked.parse(markdownText);
    const textDiv = document.createElement('div');
    textDiv.innerHTML = htmlContent; // Inject parsed HTML content into the message div
    messageDiv.appendChild(textDiv);

    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString().slice(0, 5);
    messageDiv.appendChild(timeDiv);

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}
