const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

const { EXPRESS_PORT, OLLAMA_PORT, APP_KEY } = process.env;

app.use(cors());

app.post('/ask', express.json(), async (req, res) => {
    const ollama_app_key = req.body.ollama_app_key;

    if (ollama_app_key !== APP_KEY) {
        return res.status(403).send({ message: "Forbidden: Invalid API key" });
    }

    const question = req.body.question;


    const url = `http://127.0.0.1:${OLLAMA_PORT}/api/generate`; // Ollama API endpoint

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

app.listen(EXPRESS_PORT, () => {
    console.log(`Server running at http://localhost:${EXPRESS_PORT}`);
});
