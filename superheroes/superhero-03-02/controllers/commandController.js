import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  generateUML,
  applyChanges,
  getHistory,
  initializeConversation,
  isConversationInitialized,
} from '../services/generativeAIService.js';

const router = express.Router();

// Route to process commands and messages
router.post('/', async (req, res) => {
  let { conversationId, command, message } = req.body;

  try {
    // If no conversationId is provided, create a new one
    if (!conversationId) {
      conversationId = uuidv4();
      initializeConversation(conversationId);
    }

    // Process /generate command
    if (command && command.startsWith('/generate')) {
      const args = command.split(' ').slice(1).join(' ');
      const [umlType, ...requirementsArr] = args.split(' ');
      const requirements = requirementsArr.join(' ').trim();
      
      if (!umlType || !requirements) {
        return res.status(400).json({ error: 'Usage: /generate <type> <requirements>' });
      }

      const response = await generateUML(conversationId, umlType.trim(), requirements);
      return res.json({ conversationId, ...response });
    }

    // If it's a general message
    if (message) {
      // Check if the conversation was initialized with /generate
      if (!isConversationInitialized(conversationId)) {
        return res.status(400).json({ error: 'Please start the conversation with a /generate command.' });
      }

      // Apply changes to the last UML
      const response = await applyChanges(conversationId, message);
      return res.json({ conversationId, ...response });
    }

    // If no command or message is provided
    return res.status(400).json({ error: 'A /generate command or a message is required.' });
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ error: 'Error processing the request.' });
  }
});

export default router;
