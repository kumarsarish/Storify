const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios'); // axios is needed for Copyleaks API calls

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const COPYLEAKS_API_KEY = process.env.COPYLEAKS_API_KEY; // Your Copyleaks API Key
const COPYLEAKS_EMAIL = process.env.COPYLEAKS_EMAIL; // Your Copyleaks Account Email

// Ensure API keys and URL are set
if (!FRONTEND_URL) {
    console.error("FRONTEND_URL is not set in the environment variables.");
    process.exit(1);
}
if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set in the environment variables.");
    process.exit(1);
}
if (!COPYLEAKS_API_KEY || !COPYLEAKS_EMAIL) {
    console.error("COPYLEAKS_API_KEY or COPYLEAKS_EMAIL is not set in the environment variables.");
    console.error("Please sign up at Copyleaks (https://copyleaks.com/account/register) to get your credentials.");
    process.exit(1);
}

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

let copyleaksAuthToken = null;
const COPYLEAKS_BASE_URL = 'https://api.copyleaks.com/v3';

// --- Helper Functions ---

/**
 * A generic helper function to call the OpenRouter API with retry logic.
 * It's designed to be robust and handle common API failures.
 * @param {string} prompt The text prompt to send to the AI.
 * @param {string} model The OpenRouter model to use.
 * @param {number} maxRetries The number of times to retry on failure.
 * @param {number} delay The initial delay for exponential backoff.
 * @returns {string} The text content of the AI's response.
 * @throws {Error} If the API call fails after all retries.
 */
async function callOpenRouterApi(prompt, model = 'openai/gpt-3.5-turbo', maxRetries = 3, delay = 1000) {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    };
    const body = JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }]
    });

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, { method: 'POST', headers, body });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: 'Unknown API error' } }));
                if (response.status >= 500 || response.status === 429) { // 429 is rate limit
                    console.warn(`Attempt ${i + 1} failed with status ${response.status}. Retrying... Error: ${errorData.error?.message || 'No message'}`);
                    await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
                    continue; 
                } else {
                    throw new Error(`API failed with status ${response.status}: ${errorData.error?.message || 'No message'}`);
                }
            }
            
            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            if (i === maxRetries - 1) {
                throw error;
            }
            console.warn(`Attempt ${i + 1} failed: ${error.message}. Retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
    throw new Error(`Failed to call OpenRouter API after ${maxRetries} retries.`);
}

/**
 * Authenticates with Copyleaks API and retrieves an access token.
 * Tokens expire, so this should be called periodically or on demand.
 */
async function getCopyleaksAuthToken() {
    try {
        const response = await axios.post(`${COPYLEAKS_BASE_URL}/education/users/login`, {
            email: COPYLEAKS_EMAIL,
            key: COPYLEAKS_API_KEY
        });
        copyleaksAuthToken = response.data.access_token;
        console.log('Copyleaks token obtained:', copyleaksAuthToken ? 'Success' : 'Failed');
    } catch (error) {
        console.error('Error getting Copyleaks auth token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to authenticate with Copyleaks.');
    }
}

/**
 * Submits text to Copyleaks for a plagiarism scan.
 * @param {string} text The text to scan.
 * @param {string} filename A unique identifier for the scan.
 * @returns {string} The scan ID.
 */
async function submitCopyleaksScan(text, filename) {
    if (!copyleaksAuthToken) {
        await getCopyleaksAuthToken();
    }

    const scanId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // Simple unique ID
    const base64Content = Buffer.from(text).toString('base64');

    try {
        await axios.put(`${COPYLEAKS_BASE_URL}/education/scans/submit/file/plain-text/${scanId}`, {
            base64: base64Content,
            filename: filename || `document-${scanId}.txt`,
            properties: {
                // You can configure webhooks here for real-time updates
                // For this example, we'll poll the status
                sandbox: false // Set to true for testing without consuming credits
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${copyleaksAuthToken}`
            }
        });
        return scanId;
    } catch (error) {
        console.error('Error submitting Copyleaks scan:', error.response ? error.response.data : error.message);
        throw new Error('Failed to submit Copyleaks scan.');
    }
}

/**
 * Checks the status of a Copyleaks scan.
 * @param {string} scanId The ID of the scan.
 * @returns {object} The scan status.
 */
async function checkCopyleaksScanStatus(scanId) {
    if (!copyleaksAuthToken) {
        await getCopyleaksAuthToken();
    }
    try {
        const response = await axios.get(`${COPYLEAKS_BASE_URL}/education/scans/${scanId}/status`, {
            headers: {
                'Authorization': `Bearer ${copyleaksAuthToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error checking Copyleaks scan status:', error.response ? error.response.data : error.message);
        throw new Error('Failed to check Copyleaks scan status.');
    }
}

/**
 * Retrieves the results of a completed Copyleaks scan.
 * @param {string} scanId The ID of the scan.
 * @returns {object} The scan results.
 */
async function getCopyleaksScanResults(scanId) {
    if (!copyleaksAuthToken) {
        await getCopyleaksAuthToken();
    }
    try {
        const response = await axios.get(`${COPYLEAKS_BASE_URL}/education/scans/${scanId}/result`, {
            headers: {
                'Authorization': `Bearer ${copyleaksAuthToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting Copyleaks scan results:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get Copyleaks scan results.');
    }
}

// --- API Endpoints ---

// Endpoint for interactive story generation (initial)
app.post('/generate-interactive-story', async (req, res) => {
    try {
        const { prompt, genre, length, language, tone, character, setting, styleMimic, narratorPersonality } = req.body;
        
        let fullPrompt = `Generate a compelling story based on this prompt: "${prompt}".`;
        if (genre && genre !== 'random') { fullPrompt += ` The genre should be ${genre}.`; }
        if (length) { fullPrompt += ` The story should be around ${length} words long.`; }
        if (language && language !== 'english') { fullPrompt += ` Write the story in ${language}.`; }
        if (tone) { fullPrompt += ` The tone of the story should be ${tone}.`; }
        if (character) { fullPrompt += ` The main character is: ${character}.`; }
        if (setting) { fullPrompt += ` The story is set in: ${setting}.`; }
        if (styleMimic) { fullPrompt += ` Write this story in the style of ${styleMimic}.`; }
        if (narratorPersonality) { fullPrompt += ` Narrate the story from the perspective of ${narratorPersonality}.`; }
        
        fullPrompt += ` After the story, provide exactly three choices for the user to continue the narrative, separated by commas. Example: "Go to the abandoned city, Follow the strange creature, Investigate the mysterious signal". Start the choices list with the text "Choices:".`;
        
        const rawText = await callOpenRouterApi(fullPrompt);
        
        const parts = rawText.split('Choices:');
        const story = parts[0].trim();
        const choices = parts[1] ? parts[1].split(',').map(choice => choice.trim()) : ["Continue the story", "Introduce a new character", "Shift the scene"];
        
        res.json({ story, choices });

    } catch (error) {
        console.error('Proxy error generating interactive story:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// Endpoint for mashup story generation
app.post('/generate-interactive-mashup-story', async (req, res) => {
    try {
        const { prompt, mashupPrompt, genre, length, language, tone, character, setting, styleMimic, narratorPersonality } = req.body;

        let fullPrompt = `Create a mashup story. The main idea is "${prompt}". The secondary idea to blend is "${mashupPrompt}".`;
        if (genre && genre !== 'random') { fullPrompt += ` The genre should be ${genre}.`; }
        if (length) { fullPrompt += ` The story should be around ${length} words long.`; }
        if (language && language !== 'english') { fullPrompt += ` Write the story in ${language}.`; }
        if (tone) { fullPrompt += ` The tone of the story should be ${tone}.`; }
        if (character) { fullPrompt += ` The main character is: ${character}.`; }
        if (setting) { fullPrompt += ` The story is set in: ${setting}.`; }
        if (styleMimic) { fullPrompt += ` Write this story in the style of ${styleMimic}.`; }
        if (narratorPersonality) { fullPrompt += ` Narrate the story from the perspective of ${narratorPersonality}.`; }

        fullPrompt += ` After the story, provide exactly three choices for the user to continue the narrative, separated by commas. Example: "Go to the abandoned city, Follow the strange creature, Investigate the mysterious signal". Start the choices list with the text "Choices:".`;
        
        const rawText = await callOpenRouterApi(fullPrompt);
        
        const parts = rawText.split('Choices:');
        const story = parts[0].trim();
        const choices = parts[1] ? parts[1].split(',').map(choice => choice.trim()) : ["Continue the story", "Introduce a new character", "Shift the scene"];

        res.json({ story, choices });

    } catch (error) {
        console.error('Proxy error generating mashup story:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// Endpoint for generating comic panels
app.post('/generate-comic-panels', async (req, res) => {
    const { storyText } = req.body;
    if (!storyText) { return res.status(400).json({ error: "Story text is required to generate comic panels." }); }
    
    try {
        const summaryPrompt = `Take the following story text and, for each paragraph, generate a single, concise, visually descriptive image prompt. Return only the prompts, separated by new lines. Do not add any extra text.
        Story Text:
        ${storyText}`;

        const rawImagePrompts = await callOpenRouterApi(summaryPrompt);
        const imagePrompts = rawImagePrompts.split('\n').filter(p => p.trim() !== '');
        
        const panels = [];
        const storyParagraphs = storyText.split(/\n\s*\n/).filter(p => p.trim() !== '');

        for (let i = 0; i < imagePrompts.length; i++) {
            const imagePrompt = imagePrompts[i];
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;
            const imageResponse = await fetch(imageUrl, { redirect: 'follow' }); // Changed to 'follow'
            
            let finalImageUrl = imageUrl;
            if (!imageResponse.ok) {
                 console.error(`Pollinations.AI API failed for prompt "${imagePrompt}" with status: ${imageResponse.status}`);
                 // Provide a placeholder or skip if image generation fails
                 finalImageUrl = `https://placehold.co/300x200/cccccc/000000?text=Image+Failed`; // Placeholder image
            } else {
                finalImageUrl = imageResponse.url; // The final URL after redirects
            }
            
            const text = storyParagraphs[i] || '';
            panels.push({ imageUrl: finalImageUrl, text: text });
        }
        res.json({ panels: panels });
    } catch (error) {
        console.error("Proxy error generating comic panels:", error);
        res.status(500).json({ error: "Failed to generate comic panels." });
    }
});

// Endpoint for generating title and summary
app.post('/generate-title-and-summary', async (req, res) => {
    const { storyText } = req.body;
    if (!storyText) { return res.status(400).json({ error: "Story text is required to generate a title and summary." }); }

    try {
        const prompt = `Based on the following story text, generate a concise title and a short summary. Return only the title and summary, separated by a new line. Title first, then summary.
        Story text: "${storyText}"`;
        const aiResponse = await callOpenRouterApi(prompt);
        const [title, summary] = aiResponse.split('\n');
        
        res.json({ title: title || 'Generated Log', summary: summary || 'No summary available.' });
    } catch (error) {
        console.error('Proxy error generating title and summary:', error);
        res.status(500).json({ error: "Failed to generate title and summary." });
    }
});

// Endpoint for continuing an interactive story
app.post('/continue-interactive-story', async (req, res) => {
    try {
        const { storyHistory, userChoice, isNextChapter } = req.body;
        let continuePrompt = `The story so far is:\n\n${storyHistory}\n\n`;
        if (isNextChapter) {
            continuePrompt += `Write the next chapter of the story, ending with a compelling cliffhanger to build suspense. It should be around 250 words long.`;
        } else {
            continuePrompt += `The user chose to: "${userChoice}". Continue the story from this point. The new part should be around 200 words long.`;
        }
        continuePrompt += ` After the story, provide exactly three choices for the user to continue the narrative, separated by commas. Example: "Go to the abandoned city, Follow the strange creature, Investigate the mysterious signal". Start the choices list with the text "Choices:".`;
        
        const rawText = await callOpenRouterApi(continuePrompt);
        
        const parts = rawText.split('Choices:');
        const story = parts[0].trim();
        const choices = parts[1] ? parts[1].split(',').map(choice => choice.trim()) : ["Continue the story", "Introduce a new character", "Shift the scene"];
        
        res.json({ story, choices });

    } catch (error) {
        console.error('Proxy error continuing interactive story:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// Proxy endpoint for story critique
app.post('/story-critique', async (req, res) => {
    try {
        const { storyText } = req.body;
        if (!storyText) { return res.status(400).json({ error: "No text provided for critique." }); }
        
        const critiquePrompt = `You are a professional writing coach. Critically analyze the following story text for its grammar, style, tone, and plot. Provide constructive feedback and suggestions for improvement. Respond in a clear, formatted text.
Story text: "${storyText}"`;
        const critique = await callOpenRouterApi(critiquePrompt);
        res.json({ critique });
    } catch (error) {
        console.error('Proxy error running story critique:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// Endpoint for grammar/style enhancement
app.post('/enhance-text', async (req, res) => {
    try {
        const { textToEnhance } = req.body;
        if (!textToEnhance) { return res.status(400).json({ error: "No text provided for enhancement." }); }
        const enhancePrompt = `Act as a professional editor. Improve the grammar, syntax, and style of the following text, while preserving its original meaning and tone. Return only the enhanced text. Do not add any extra commentary.
        Text to enhance: "${textToEnhance}"`;
        const enhancedText = await callOpenRouterApi(enhancePrompt);
        res.json({ enhancedText });
    } catch (error) {
        console.error('Proxy error enhancing text:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// Proxy endpoint for Pollinations.AI image generation
app.post('/generate-image', async (req, res) => {
    try {
        const { prompt, aspectRatio, style, styleTransfer, resolution, seed } = req.body;
        let fullPrompt = prompt;
        if (style && style !== 'random') { fullPrompt += `, in the style of a ${style}`; }
        if (styleTransfer) { fullPrompt += `, in the style of a ${styleTransfer}`; }
        if (resolution) { fullPrompt += `, ${resolution}`; }
        if (seed) { fullPrompt += `, seed: ${seed}`; }
        
        let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`;
        
        // Pollinations.ai often redirects, so follow the redirect to get the final image URL
        const response = await fetch(imageUrl, { redirect: 'follow' }); 
        if (!response.ok) {
             return res.status(response.status).json({ error: `Pollinations.AI API failed with status: ${response.status}` });
        }
        
        // The URL after following redirects will be the direct image URL
        return res.json({ url: response.url });

    } catch (error) {
        console.error("Proxy error generating image:", error);
        res.status(500).json({ error: "Failed to communicate with Pollinations.AI." });
    }
});

// Proxy endpoint for AI likeness scan (still uses OpenRouter for explanation)
app.post('/run-ai-scan', async (req, res) => {
    try {
        const { textToScan } = req.body;
        if (!textToScan) { return res.status(400).json({ error: "No text provided for scan." }); }
        
        const scanPrompt = `Analyze the following text and provide a score from 0 to 100 on how likely it is to be AI-generated, where 0 is highly human and 100 is highly AI. Also, provide a short explanation for the score. Respond with a JSON object containing "score" (a number) and "explanation" (a string). Do not include any extra text.
Text to analyze: "${textToScan}"`;
        
        const aiResponse = await callOpenRouterApi(scanPrompt);

        let scanResult;
        try {
            scanResult = JSON.parse(aiResponse);
        } catch (e) {
            console.error("Failed to parse AI scan JSON:", e);
            // Try to extract score and explanation even if not perfect JSON
            const scoreMatch = aiResponse.match(/"score"\s*:\s*(\d+)/);
            const explanationMatch = aiResponse.match(/"explanation"\s*:\s*"(.*?)"/);
            if (scoreMatch && explanationMatch) {
                scanResult = { score: parseInt(scoreMatch[1], 10), explanation: explanationMatch[1] };
            } else {
                return res.status(500).json({ error: "AI response was not valid JSON and could not be parsed." });
            }
        }
        res.json({ score: scanResult.score, explanation: scanResult.explanation });
    } catch (error) {
        console.error('Proxy error running AI scan:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter or parse its response." });
    }
});

// Proxy endpoint for plagiarism check (now uses Copyleaks)
app.post('/plagiarism-check', async (req, res) => {
    try {
        const { textToCheck } = req.body;
        if (!textToCheck) { return res.status(400).json({ error: "No text provided for plagiarism check." }); }
        
        // Ensure we have a token
        if (!copyleaksAuthToken) {
            await getCopyleaksAuthToken();
        }

        const scanId = await submitCopyleaksScan(textToCheck, `plagiarism-check-${Date.now()}.txt`);

        let statusResponse;
        let isCompleted = false;
        let retries = 0;
        const MAX_POLLING_RETRIES = 30; // Max 30 retries, ~30 seconds if 1s delay
        const POLLING_INTERVAL = 1000; // 1 second

        while (!isCompleted && retries < MAX_POLLING_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
            statusResponse = await checkCopyleaksScanStatus(scanId);
            if (statusResponse.status === 'completed') {
                isCompleted = true;
            } else {
                retries++;
            }
        }

        if (!isCompleted) {
            throw new Error('Copyleaks scan did not complete in time.');
        }

        const copyleaksResult = await getCopyleaksScanResults(scanId);
        
        // Copyleaks result structure can be complex.
        // For simplicity, we'll try to extract a general match percentage.
        // A real application might want to display more detailed information.
        const totalIdenticalWords = copyleaksResult.results.reduce((sum, current) => {
            if (current.isIdentical && current.matchedWords) {
                return sum + current.matchedWords.length;
            }
            return sum;
        }, 0);

        const totalWords = textToCheck.split(/\s+/).filter(word => word.length > 0).length;
        const plagiarismScore = totalWords > 0 ? ((totalIdenticalWords / totalWords) * 100).toFixed(2) : 0;

        let explanation = `Copyleaks found ${copyleaksResult.results.length} matches. `;
        if (plagiarismScore > 0) {
            explanation += `Approximately ${plagiarismScore}% of the text is identical to found sources.`;
        } else {
            explanation += `No significant identical matches found.`;
        }
        if (copyleaksResult.results.length > 0) {
            explanation += ` Detected sources: ${copyleaksResult.results.map(r => r.url).join(', ')}`;
        }


        res.json({ plagiarismScore, explanation });

    } catch (error) {
        console.error('Proxy error running plagiarism check:', error);
        res.status(500).json({ error: "Failed to run plagiarism check with Copyleaks. Please ensure your API key and email are correct and you have sufficient credits." });
    }
});

// Proxy endpoint for translation
app.post('/translate-story', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;
        if (!text || !targetLanguage) { return res.status(400).json({ error: "Text and target language are required for translation." }); }
        
        const translatePrompt = `Translate the following text into ${targetLanguage}:\n\n${text}`;
        const translatedText = await callOpenRouterApi(translatePrompt);
        res.json({ translatedText });
    } catch (error) {
        console.error('Proxy error translating story:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// Endpoint for AI World-Building Generation
app.post('/generate-world-building', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) { return res.status(400).json({ error: "Prompt is required for world building." }); }
    try {
        const worldPrompt = `Generate a detailed world-building document for a fictional world based on this prompt: "${prompt}". Include details on history, geography, key characters, and major conflicts. Format the output with clear headings and paragraphs.`;
        const worldContent = await callOpenRouterApi(worldPrompt);
        res.json({ worldContent });
    } catch (error) {
        console.error('Proxy error generating world-building:', error);
        res.status(500).json({ error: "Failed to communicate with OpenRouter." });
    }
});

// NEW: Endpoint for Plot Outliner
app.post('/plot-outliner', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) { return res.status(400).json({ error: "Text is required for plot outlining." }); }
        
        const plotPrompt = `Generate a detailed plot outline for the following story idea/text. Include main plot points, character arcs, and potential twists. Structure it clearly.
        Text: "${text}"`;
        const plotOutline = await callOpenRouterApi(plotPrompt);
        res.json({ plotOutline });
    } catch (error) {
        console.error('Proxy error generating plot outline:', error);
        res.status(500).json({ error: "Failed to generate plot outline with OpenRouter." });
    }
});

// NEW: Endpoint for Dialogue Writer
app.post('/dialogue-writer', async (req, res) => {
    try {
        const { context, instruction } = req.body;
        if (!context || !instruction) { return res.status(400).json({ error: "Context and instruction are required for dialogue generation." }); }
        
        const dialoguePrompt = `Based on the following context: "${context}", write a short dialogue snippet according to this instruction: "${instruction}". Focus only on the dialogue, with character names preceding their lines.`;
        const dialogue = await callOpenRouterApi(dialoguePrompt);
        res.json({ dialogue });
    } catch (error) {
        console.error('Proxy error generating dialogue:', error);
        res.status(500).json({ error: "Failed to generate dialogue with OpenRouter." });
    }
});


app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    // Attempt to get Copyleaks token on startup
    getCopyleaksAuthToken().catch(err => console.error("Initial Copyleaks token fetch failed:", err.message));
});

