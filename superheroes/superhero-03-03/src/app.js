const express = require('express');
var cors = require('cors')
const promptRoutes = require('./routes/geminiRoutes');
const chatRoutes = require('./routes/chatRoutes');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../..', '.env') });

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors())

// Routes
app.use('/api', promptRoutes);
app.use('/req2speech/chat', chatRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
