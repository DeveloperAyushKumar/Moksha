// For Windows User bot.js

// Importing All Necessary Packages
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// Creating instances 
// const genAI = new GoogleGenerativeAI(process.env.CHATBOT_API_KEY);
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Initializing GenAI model
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Function to generate response from AI model and reply to user
async function generate(prompt, message) {
    try {
        const BackendURL = "http://localhost:8000";
        const res = await axios.post(`${BackendURL}/chatbot/generate-response/`, {
            text: prompt,
            user_id: "67ac73a4269575856fbffaa5",
        });

        console.log(res.data);
        const text = res.data.response;

        await message.reply(text); // Reply to user
    } catch (error) {
        console.error("Error generating response:", error);
        await message.reply("Sorry, an error occurred while processing your request.");
    }
}

async function generateTest(prompt) {
    try {
        const BackendURL = "http://localhost:8000";
        console.log(BackendURL);
        console.log(`${BackendURL}/chatbot/generate-response/`);

        const res = await axios.post(`${BackendURL}/chatbot/generate-response/`, {
            text: prompt,
            user_id: "67ac73a4269575856fbffaa5",
        });

        const text = res.data.response;
        console.log(text);
    } catch (error) {
        console.error("Error generating response:", error);
    }
}

// All event listeners to track client status
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Client is authenticated!');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('disconnected', () => {
    console.log('Client is disconnected!');
});

client.on('auth_failure', () => {
    console.log('Client authentication failed!');
});

client.on('message', async (message) => {
    if (message.body.includes('.bot')) {
        console.log(message);
        let query;

        // Extracting text from message body using regular expression
        const regxmatch = message.body.match(/.bot(.+)/);

        // If no text follows .bot, use "Hi" as default text
        if (regxmatch) {
            query = regxmatch[1].trim();
        } else {
            console.log("No regex match!");
            query = "Hi";
        }

        // Call the generate function
        generate(query, message);
    }
});

// Initialize the WhatsApp client
client.initialize();
// generateTest("hi");
