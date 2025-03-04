const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Import the cors package

const app = express();
const port = 7799;

// Enable CORS for all origins (for development purposes)
app.use(cors());

// Handle API requests for asking questions
app.post('/ask', express.json(), async (req, res) => {
    const question = req.body.question;

    const url = "http://127.0.0.1:11434/api/generate"; // Ollama API endpoint

    const body = {
        model: "deepseek-r1:1.5b", // Use mistral for simple questions
        prompt: question, // The question to ask
        stream: true // Enable streaming
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json',
            },
            responseType: 'stream' // Set response type to stream
        });

        // Set the response headers for streaming
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        // Pipe the streaming response to the client
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send("Error fetching response: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
