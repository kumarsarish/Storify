// WARNING: The PROXY_SERVER_URL needs to point to your Node.js backend.
const PROXY_SERVER_URL = "http://127.0.0.1:3000";

// DOM Elements
const storyInput = document.getElementById('story-input');
const generateBtn = document.getElementById('generate-btn');
const loadingSection = document.getElementById('loading-section');
const storyDisplay = document.getElementById('story-display');
const charCount = document.getElementById('char-count');
const genreSelect = document.getElementById('genre-select');
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');
const copyBtn = document.getElementById('copy-btn');
const playTtsBtn = document.getElementById('play-tts-btn');
const pauseTtsBtn = document.getElementById('pause-tts-btn');
const stopTtsBtn = document.getElementById('stop-tts-btn');

const imagePromptInput = document.getElementById('image-prompt-input');
const imagePromptCharCount = document.getElementById('image-prompt-char-count');
const generateImageBtn = document.getElementById('generate-image-btn');
const imageLoadingSection = document.getElementById('image-loading-section');
const generatedImageContainer = document.getElementById('generated-image-container');

const aiScanInput = document.getElementById('ai-scan-input');
const runAiScanBtn = document.getElementById('run-ai-scan-btn');
const aiScanLoadingSection = document.getElementById('ai-scan-loading-section');
const aiScanResult = document.getElementById('ai-scan-result');
const aiLikenessScore = document.getElementById('ai-likeness-score');
const aiLikenessExplanation = document.getElementById('ai-likeness-explanation');
const aiScanCharCount = document.getElementById('ai-scan-char-count');
const plagiarismCheckBtn = document.getElementById('plagiarism-check-btn');
const plagiarismResult = document.getElementById('plagiarism-result');
const plagiarismScore = document.getElementById('plagiarism-score');
const plagiarismExplanation = document.getElementById('plagiarism-explanation');

const storyGeneratorPage = document.getElementById('story-generator-page');
const storyDisplayPage = document.getElementById('story-display-page');
const imageGeneratorPage = document.getElementById('image-generator-page');
const aiScanPage = document.getElementById('ai-scan-page');
const myStoriesPage = document.getElementById('my-stories-page');
const storiesList = document.getElementById('stories-list');
const userStoryPage = document.getElementById('user-story-page');
const userStoryInput = document.getElementById('user-story-input');
const saveUserStoryBtn = document.getElementById('save-user-story-btn');
const userStoryCharCount = document.getElementById('user-story-char-count');

const navStoryBtn = document.getElementById('nav-story-generator-btn');
const navImageBtn = document.getElementById('nav-image-generator-btn');
const navScanBtn = document.getElementById('nav-ai-scan-btn');
const navMyStoriesBtn = document.getElementById('nav-my-stories-btn');
const navWorldBuildingBtn = document.getElementById('nav-world-building-btn');
const navUserStoryBtn = document.getElementById('nav-user-story-btn');

const languageSelect = document.getElementById('language-select');
const toneInput = document.getElementById('tone-input');
const characterInput = document.getElementById('character-input');
const settingInput = document.getElementById('setting-input');
const styleSelect = document.getElementById('style-select');
const illustrationModeCheckbox = document.getElementById('illustration-mode-checkbox');
const storyIllustrations = document.getElementById('story-illustrations');
const storyChoices = document.getElementById('story-choices');
const choice1Btn = document.getElementById('choice-1-btn');
const choice2Btn = document.getElementById('choice-2-btn');
const choice3Btn = document.getElementById('choice-3-btn');
const templateSelect = document.getElementById('template-select');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;
const shareBtn = document.getElementById('share-btn');

const voiceSelect = document.getElementById('voice-select');
const aspectRatioSelect = document.getElementById('aspect-ratio-select');
const resolutionSelect = document.getElementById('resolution-select');
const translateBtn = document.getElementById('translate-btn');
const translateLanguageSelect = document.getElementById('translate-language-select');

const critiqueInput = document.getElementById('critique-input');
const runCritiqueBtn = document.getElementById('run-critique-btn');
const critiqueLoadingSection = document.getElementById('critique-loading-section');
const critiqueResult = document.getElementById('critique-result');

const mashupPromptInput = document.getElementById('mashup-prompt-input');
const mashupCharCount = document.getElementById('mashup-char-count');
const mashupBtn = document.getElementById('mashup-btn');

const lengthPresetSelect = document.getElementById('length-preset-select');
const saveStoryBtn = document.getElementById('save-story-btn');

const generateComicBtn = document.getElementById('generate-comic-btn');
const comicPanelsContainer = document.getElementById('comic-panels-container');
const storyTitleEl = document.getElementById('story-title');
const storySummaryEl = document.getElementById('story-summary');

const enhanceBtn = document.getElementById('enhance-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');
const exportDocxBtn = document.getElementById('export-docx-btn');
const nextChapterBtn = document.getElementById('next-chapter-btn');

const worldBuildingPage = document.getElementById('world-building-page');
const worldBuildingInput = document.getElementById('world-building-input');
const generateWorldBtn = document.getElementById('generate-world-btn');
const worldBuildingLoadingSection = document.getElementById('world-building-loading-section');
const worldBuildingDisplay = document.getElementById('world-building-display');
const worldBuildingCharCount = document.getElementById('world-building-char-count');

const storyPromptHistory = document.getElementById('story-prompt-history');
const imagePromptHistory = document.getElementById('image-prompt-history');

const styleMimicInput = document.getElementById('style-mimic-input');
const variationsCountSelect = document.getElementById('variations-count-select');
const styleTransferInput = document.getElementById('style-transfer-input');
const narratorPersonalityInput = document.getElementById('narrator-personality-input');

const storyMicBtn = document.getElementById('story-mic-btn');
const mashupMicBtn = document.getElementById('mashup-mic-btn');
const imageMicBtn = document.getElementById('image-mic-btn');

const storyWordCount = document.getElementById('story-word-count');
const mashupWordCount = document.getElementById('mashup-word-count');
const imageWordCount = document.getElementById('image-word-count');

const plotOutlinerInput = document.getElementById('plot-outliner-input');
const generatePlotBtn = document.getElementById('generate-plot-btn');
const plotOutlinerLoadingSection = document.getElementById('plot-outliner-loading-section');
const plotOutlinerResult = document.getElementById('plot-outliner-result');

const dialogueContextInput = document.getElementById('dialogue-context-input');
const dialogueInstructionInput = document.getElementById('dialogue-instruction-input');
const generateDialogueBtn = document.getElementById('generate-dialogue-btn');
const dialogueWriterLoadingSection = document.getElementById('dialogue-writer-loading-section');
const dialogueWriterResult = document.getElementById('dialogue-writer-result');


let lastGeneratedStoryText = "";
let storyHistory = "";
const synth = window.speechSynthesis;
let currentUtterance = null;
let savedStories = []; // This will now be populated from localStorage

const confirmationModalOverlay = document.getElementById('confirmation-modal-overlay');
const confirmationModalMessage = document.getElementById('confirmation-modal-message');
const confirmYesBtn = document.getElementById('confirm-yes');
const confirmNoBtn = document.getElementById('confirm-no');
let confirmPromiseResolve = null;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
}

// --- Local Storage Functions (Moved to top) ---

// Function to save a story to localStorage
async function saveStoryToLocalStorage(storyData) {
    let savedStories = JSON.parse(localStorage.getItem('savedStories')) || [];
    // Assign a unique ID if not present (for new stories)
    if (!storyData.id) {
        storyData.id = Date.now();
    }
    savedStories.push(storyData);
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    showNotification('Story saved to local storage successfully!', 'success');
}

// Function to load saved stories from localStorage
async function loadStoriesFromLocalStorage() {
    const storiesJSON = localStorage.getItem('savedStories');
    return storiesJSON ? JSON.parse(storiesJSON) : [];
}

// Function to delete a story from localStorage
async function deleteStoryFromLocalStorage(storyId) {
    let savedStories = JSON.parse(localStorage.getItem('savedStories')) || [];
    savedStories = savedStories.filter(story => story.id != storyId);
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    showNotification('Story deleted from local storage successfully.', 'success');
}

// --- End Local Storage Functions ---

// Function to show custom confirmation modal
function showConfirmationModal(message) {
    confirmationModalMessage.textContent = message;
    confirmationModalOverlay.classList.add('show');

    return new Promise((resolve) => {
        confirmPromiseResolve = resolve;
    });
}

// Function to hide custom confirmation modal
function hideConfirmationModal() {
    confirmationModalOverlay.classList.remove('show');
    confirmPromiseResolve = null;
}


document.addEventListener('DOMContentLoaded', async function() {
    setupEventListeners();
    showPage('story-generator-page');
    loadUserTheme();
    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }
    savedStories = await loadStoriesFromLocalStorage(); // Initialize savedStories array
    displayPromptHistory('story');
    displayPromptHistory('image');
});

function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active-page'));
    document.getElementById(pageId).classList.add('active-page');

    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active-nav'));
    
    let navButtonId;
    if (pageId === 'story-generator-page') navButtonId = 'nav-story-generator-btn';
    else if (pageId === 'image-generator-page') navButtonId = 'nav-image-generator-btn';
    else if (pageId === 'world-building-page') navButtonId = 'nav-world-building-btn';
    else if (pageId === 'ai-scan-page') navButtonId = 'nav-ai-scan-btn';
    else if (pageId === 'my-stories-page') navButtonId = 'nav-my-stories-btn';
    else if (pageId === 'user-story-page') navButtonId = 'nav-user-story-btn';
    
    const navButton = document.getElementById(navButtonId);
    if (navButton) {
        navButton.classList.add('active-nav');
    }
    
    if (synth.speaking) {
        synth.cancel();
        updateTtsButtons('initial');
    }
}

function setupEventListeners() {
    storyInput.addEventListener('input', () => { 
        charCount.textContent = storyInput.value.length;
        storyWordCount.textContent = getWordCount(storyInput.value);
    });
    mashupPromptInput.addEventListener('input', () => {
        mashupCharCount.textContent = mashupPromptInput.value.length;
        mashupWordCount.textContent = getWordCount(mashupPromptInput.value);
    });
    imagePromptInput.addEventListener('input', () => {
        imagePromptCharCount.textContent = imagePromptInput.value.length;
        imageWordCount.textContent = getWordCount(imagePromptInput.value);
    });
    aiScanInput.addEventListener('input', () => aiScanCharCount.textContent = aiScanInput.value.length);
    worldBuildingInput.addEventListener('input', () => worldBuildingCharCount.textContent = worldBuildingInput.value.length);
    userStoryInput.addEventListener('input', () => userStoryCharCount.textContent = userStoryInput.value.length); 

    lengthSlider.addEventListener('input', () => { lengthValue.textContent = lengthSlider.value; });
    
    lengthPresetSelect.addEventListener('change', (event) => {
        const presetValue = event.target.value;
        if (presetValue) {
            lengthSlider.value = presetValue;
            lengthValue.textContent = presetValue;
        }
    });

    templateSelect.addEventListener('change', (event) => {
        const selectedTemplate = event.target.value;
        if (selectedTemplate) {
            storyInput.value = selectedTemplate;
            storyInput.dispatchEvent(new Event('input'));
        }
    });

    generateBtn.addEventListener('click', generateMagicalStory);
    mashupBtn.addEventListener('click', generateMashupStory);
    copyBtn.addEventListener('click', copyStory);
    saveStoryBtn.addEventListener('click', saveStory);
    generateComicBtn.addEventListener('click', generateComic);
    generateWorldBtn.addEventListener('click', generateWorldBuilding);
    
    exportPdfBtn.addEventListener('click', exportToPdf);
    exportDocxBtn.addEventListener('click', exportToDocx);

    generateImageBtn.addEventListener('click', () => {
        const imagePrompt = imagePromptInput.value.trim();
        if (imagePrompt) generateStoryImage();
        else showNotification('Please enter a prompt!', 'error');
    });

    runAiScanBtn.addEventListener('click', runAILikenessScan);
    plagiarismCheckBtn.addEventListener('click', runPlagiarismCheck); 
    
    navStoryBtn.addEventListener('click', () => showPage('story-generator-page'));
    navImageBtn.addEventListener('click', () => showPage('image-generator-page'));
    navWorldBuildingBtn.addEventListener('click', () => showPage('world-building-page'));
    navScanBtn.addEventListener('click', () => showPage('ai-scan-page'));
    navMyStoriesBtn.addEventListener('click', () => {
        showPage('my-stories-page');
        displaySavedStories();
    });
    navUserStoryBtn.addEventListener('click', () => showPage('user-story-page')); 
    saveUserStoryBtn.addEventListener('click', saveUserStory); 

    playTtsBtn.addEventListener('click', () => {
        if (synth.paused) {
            synth.resume();
            updateTtsButtons('playing');
        } else {
            startTtsPlayback();
        }
    });
    pauseTtsBtn.addEventListener('click', () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            updateTtsButtons('paused');
        }
    });
    stopTtsBtn.addEventListener('click', () => {
        synth.cancel();
        updateTtsButtons('initial');
    });

    choice1Btn.addEventListener('click', () => continueStory(choice1Btn.textContent));
    choice2Btn.addEventListener('click', () => continueStory(choice2Btn.textContent));
    choice3Btn.addEventListener('click', () => continueStory(choice3Btn.textContent));
    nextChapterBtn.addEventListener('click', () => continueStory(null, true));

    themeToggleBtn.addEventListener('click', toggleTheme);
    shareBtn.addEventListener('click', shareStory);

    runCritiqueBtn.addEventListener('click', runStoryCritique);
    enhanceBtn.addEventListener('click', enhanceStory);

    translateBtn.addEventListener('click', translateStory);

    storyMicBtn.addEventListener('click', () => startVoiceRecognition(storyInput));
    mashupMicBtn.addEventListener('click', () => startVoiceRecognition(mashupPromptInput));
    imageMicBtn.addEventListener('click', () => startVoiceRecognition(imagePromptInput));

    generatePlotBtn.addEventListener('click', runPlotOutliner);
    generateDialogueBtn.addEventListener('click', generateDialogue);

    confirmYesBtn.addEventListener('click', () => {
        if (confirmPromiseResolve) {
            confirmPromiseResolve(true);
        }
        hideConfirmationModal();
    });
    confirmNoBtn.addEventListener('click', () => {
        if (confirmPromiseResolve) {
            confirmPromiseResolve(false);
        }
        hideConfirmationModal();
    });
}

function getWordCount(text) {
    if (!text) return '0 words';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return `${words.length} words`;
}

function startVoiceRecognition(inputElement) {
    if (!recognition) {
        showNotification('Voice recognition is not supported in this browser.', 'error');
        return;
    }

    recognition.start();
    showNotification('Listening...', 'info');

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        inputElement.value = transcript;
        inputElement.dispatchEvent(new Event('input'));
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        showNotification(`Voice recognition error: ${event.error}`, 'error');
    };

    recognition.onend = () => {
        showNotification('Voice recognition ended.', 'info');
    };
}

function populateVoiceList() {
    const voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        if (voice.default) {
            option.textContent += ' -- DEFAULT';
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
}

function startTtsPlayback() {
    if (synth.speaking) synth.cancel();
    
    const storyText = storyDisplay.textContent;
    if (!storyText) {
        showNotification('No story to play!', 'error');
        return;
    }
    
    const selectedVoiceName = voiceSelect.options[voiceSelect.selectedIndex]?.getAttribute('data-name');
    const voices = synth.getVoices();
    const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);

    currentUtterance = new SpeechSynthesisUtterance(storyText);
    if (selectedVoice) {
        currentUtterance.voice = selectedVoice;
    }
    currentUtterance.onend = () => updateTtsButtons('initial');
    currentUtterance.onerror = (event) => console.error('TTS error:', event);

    synth.speak(currentUtterance);
    updateTtsButtons('playing');
}

function toggleTheme() {
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    themeToggleBtn.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

function loadUserTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        body.classList.remove('light-mode');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = notification.querySelector('.notification-text');
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function typewriterEffect(text, element, speed = 15) {
    let i = 0;
    element.textContent = '';
    return new Promise(resolve => {
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

async function shareStory() {
    const storyText = storyDisplay.textContent;
    if (!storyText) {
        showNotification('No story to share!', 'error');
        return;
    }
    
    const shareData = {
        title: 'Quantum Narrative Engine Story',
        text: storyText,
        url: window.location.href
    };

    try {
        if (navigator.share && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            showNotification('Story shared successfully!', 'success');
        } else {
            document.execCommand('copy');
            showNotification('Story copied to clipboard!', 'success');
        }
    } catch (err) {
        console.error('Error sharing:', err);
        showNotification('Failed to share story.', 'error');
    }
}

async function runStoryCritique() {
    const storyText = critiqueInput.value.trim();
    if (!storyText) {
        showNotification('Please enter a story to critique.', 'error');
        return;
    }

    critiqueLoadingSection.style.display = 'block';
    runCritiqueBtn.disabled = true;
    critiqueResult.style.display = 'none';

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/story-critique`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyText: storyText })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to get story critique from proxy.");
        }

        critiqueResult.textContent = result.critique;
        critiqueResult.style.display = 'block';
        showNotification('Critique complete!', 'success');

    } catch (error) {
        console.error('Error running story critique:', error);
        critiqueResult.textContent = 'Failed to get critique. Please try again.';
        critiqueResult.style.display = 'block';
        showNotification('Failed to get story critique.', 'error');
    } finally {
        critiqueLoadingSection.style.display = 'none';
        runCritiqueBtn.disabled = false;
    }
}

async function enhanceStory() {
    const textToEnhance = critiqueInput.value.trim();
    if (!textToEnhance) {
        showNotification('Please enter text to enhance.', 'error');
        return;
    }

    critiqueLoadingSection.style.display = 'block';
    enhanceBtn.disabled = true;

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/enhance-text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textToEnhance })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to enhance text from proxy.");
        }

        critiqueInput.value = result.enhancedText;
        showNotification('Text enhanced successfully!', 'success');

    } catch (error) {
        console.error('Error enhancing text:', error);
        showNotification('Failed to enhance text. Please try again.', 'error');
    } finally {
        critiqueLoadingSection.style.display = 'none';
        enhanceBtn.disabled = false;
    }
}


async function generateMagicalStory() {
    const prompt = storyInput.value.trim();
    const mashupPrompt = mashupPromptInput.value.trim();

    if (mashupPrompt) {
        showNotification('Use the "Mashup Stories" button to combine prompts.', 'info');
        return;
    }

    if (!prompt) {
        showNotification('Please enter a prompt!', 'error');
        return;
    }

    const genre = genreSelect.value;
    const length = lengthSlider.value;
    const language = languageSelect.value;
    const tone = toneInput.value.trim();
    const character = characterInput.value.trim();
    const setting = settingInput.value.trim();
    const styleMimic = styleMimicInput.value.trim();
    const narratorPersonality = narratorPersonalityInput.value.trim();
    
    loadingSection.style.display = 'block';
    generateBtn.disabled = true;
    mashupBtn.disabled = true;
    generateComicBtn.disabled = true;
    storyIllustrations.innerHTML = '';
    storyIllustrations.style.display = 'none';
    comicPanelsContainer.innerHTML = '';
    comicPanelsContainer.style.display = 'none';
    storyDisplay.style.display = 'block';

    storyHistory = "";
    storyChoices.style.display = 'none';
    savePrompt('story', prompt);

    try {
        const isIllustrationMode = illustrationModeCheckbox.checked;

        const response = await fetch(`${PROXY_SERVER_URL}/generate-interactive-story`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: prompt,
                genre: genre,
                length: length,
                language: language,
                tone: tone,
                character: character,
                setting: setting,
                styleMimic: styleMimic,
                narratorPersonality: narratorPersonality,
                isIllustrationMode: isIllustrationMode
            })
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to generate story from proxy.");
        }
        
        const storyPart = result.story;
        const choices = result.choices;
        
        storyHistory += storyPart;
        
        storyDisplay.textContent = '';
        showNotification('Story is generating...', 'info');
        showPage('story-display-page');

        await typewriterEffect(storyPart, storyDisplay);
        
        updateStoryChoices(choices);

        generateTitleAndSummary(storyPart);
        
        showNotification('Story generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating story:', error);
        showNotification('Failed to generate story. Check your backend and API key.', 'error');
    } finally {
        loadingSection.style.display = 'none';
        generateBtn.disabled = false;
        mashupBtn.disabled = false;
        generateComicBtn.disabled = false;
    }
}

async function generateMashupStory() {
    const prompt = storyInput.value.trim();
    const mashupPrompt = mashupPromptInput.value.trim();

    if (!prompt || !mashupPrompt) {
        showNotification('Please provide both a main and a mashup prompt!', 'error');
        return;
    }

    const genre = genreSelect.value;
    const length = lengthSlider.value;
    const language = languageSelect.value;
    const tone = toneInput.value.trim();
    const character = characterInput.value.trim();
    const setting = settingInput.value.trim();
    const styleMimic = styleMimicInput.value.trim();
    const narratorPersonality = narratorPersonalityInput.value.trim();

    loadingSection.style.display = 'block';
    generateBtn.disabled = true;
    mashupBtn.disabled = true;
    generateComicBtn.disabled = true;
    storyIllustrations.innerHTML = '';
    storyIllustrations.style.display = 'none';
    comicPanelsContainer.innerHTML = '';
    comicPanelsContainer.style.display = 'none';
    storyDisplay.style.display = 'block';

    storyHistory = "";
    storyChoices.style.display = 'none';
    savePrompt('story', `Mashup of: ${prompt} and ${mashupPrompt}`);
    
    try {
        const isIllustrationMode = illustrationModeCheckbox.checked;

        const response = await fetch(`${PROXY_SERVER_URL}/generate-interactive-mashup-story`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt,
                mashupPrompt,
                genre,
                length,
                language,
                tone,
                character,
                setting,
                styleMimic,
                narratorPersonality,
                isIllustrationMode
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to generate mashup story from proxy.");
        }

        const storyPart = result.story;
        const choices = result.choices;
        
        storyHistory += storyPart;
        
        storyDisplay.textContent = '';
        showNotification('Mashup story is generating...', 'info');
        showPage('story-display-page');

        await typewriterEffect(storyPart, storyDisplay);
        
        updateStoryChoices(choices);

        generateTitleAndSummary(storyPart);
        
        showNotification('Mashup story generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating mashup story:', error);
        showNotification('Failed to generate mashup story. Check your backend.', 'error');
    } finally {
        loadingSection.style.display = 'none';
        generateBtn.disabled = false;
        mashupBtn.disabled = false;
        generateComicBtn.disabled = false;
    }
}

async function continueStory(userChoice, isNextChapter = false) {
    loadingSection.style.display = 'block';
    storyChoices.style.display = 'none';
    
    if (userChoice) {
        storyHistory += `\n\n[You chose: "${userChoice}"]\n\n`;
    }
    if (isNextChapter) {
        storyHistory += `\n\n--- End of Chapter ---\n\n`;
    }
    storyDisplay.textContent = storyHistory;
    
    try {
        const response = await fetch(`${PROXY_SERVER_URL}/continue-interactive-story`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                storyHistory: storyHistory,
                userChoice: userChoice,
                isNextChapter: isNextChapter
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || "Failed to continue story from proxy.");
        }
        
        const newStoryPart = result.story;
        const choices = result.choices;

        storyHistory += newStoryPart;
        
        await typewriterEffect(newStoryPart, storyDisplay);
        
        updateStoryChoices(choices);
        
        showNotification('Story continues!', 'success');
        
    } catch (error) {
        console.error('Error continuing story:', error);
        showNotification('Failed to continue story. Please try again.', 'error');
    } finally {
        loadingSection.style.display = 'none';
    }
}

function updateStoryChoices(choices) {
    if (choices && choices.length === 3) {
        choice1Btn.textContent = choices[0];
        choice2Btn.textContent = choices[1];
        choice3Btn.textContent = choices[2];
        storyChoices.style.display = 'flex';
    } else {
        storyChoices.style.display = 'none';
    }
}

async function generateTitleAndSummary(storyText) {
    try {
        const response = await fetch(`${PROXY_SERVER_URL}/generate-title-and-summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyText })
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Failed to generate title and summary.");
        }
        
        storyTitleEl.textContent = result.title;
        storySummaryEl.textContent = result.summary;
    } catch (error) {
        console.error('Error generating title and summary:', error);
        storyTitleEl.textContent = 'Generated Log';
        storySummaryEl.textContent = 'Failed to generate title and summary.';
    }
}

async function generateComic() {
    const storyContent = storyDisplay.textContent.trim();
    if (!storyContent) {
        showNotification('Please generate a story first!', 'error');
        return;
    }

    loadingSection.style.display = 'block';
    generateBtn.disabled = true;
    mashupBtn.disabled = true;
    generateComicBtn.disabled = true;
    storyDisplay.style.display = 'none';
    comicPanelsContainer.innerHTML = '';
    comicPanelsContainer.style.display = 'flex';
    storyIllustrations.style.display = 'none';

    showNotification('Generating comic panels... this may take a moment.', 'info');
    
    try {
        const response = await fetch(`${PROXY_SERVER_URL}/generate-comic-panels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyText: storyContent })
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to generate comic from proxy.");
        }
        
        if (result.panels && result.panels.length > 0) {
            result.panels.forEach(panel => {
                const panelElement = document.createElement('div');
                panelElement.classList.add('comic-panel');
                panelElement.innerHTML = `
                    <img src="${panel.imageUrl}" alt="Comic panel image" style="width:100%; max-width: 300px; height: auto; border-radius:5px; display: block; margin: 0 auto;">
                    <p style="text-align: center; margin-top: 10px;">${panel.text}</p>
                `;
                comicPanelsContainer.appendChild(panelElement);
            });
            showNotification('Comic generated successfully!', 'success');
        } else {
            showNotification('No comic panels generated. Try a different story.', 'error');
            storyDisplay.style.display = 'block';
        }

    } catch (error) {
        console.error('Error generating comic:', error);
        showNotification('Failed to generate comic. Please check the backend.', 'error');
        storyDisplay.style.display = 'block';
        comicPanelsContainer.style.display = 'none';
    } finally {
        loadingSection.style.display = 'none';
        generateBtn.disabled = false;
        mashupBtn.disabled = false;
        generateComicBtn.disabled = false;
    }
}

async function saveStory() {
    const storyContent = storyDisplay.textContent;
    if (!storyContent.trim()) {
        showNotification('Cannot save an empty story!', 'error');
        return;
    }

    const storyTitle = storyTitleEl.textContent || 'Untitled Story';
    const storySummary = storySummaryEl.textContent || 'No summary available.';
    
    const newStory = {
        title: storyTitle,
        content: storyContent,
        summary: storySummary,
        date: new Date().toLocaleString()
    };

    await saveStoryToLocalStorage(newStory);
}

async function saveUserStory() {
    const userStoryContent = userStoryInput.value.trim();
    if (!userStoryContent) {
        showNotification('Please enter a story to save!', 'error');
        return;
    }

    const storyTitlePrompt = "Please enter a title for your story:";
    
    const inputModal = document.createElement('div');
    inputModal.className = 'modal-overlay show';
    inputModal.innerHTML = `
        <div class="custom-modal">
            <p>${storyTitlePrompt}</p>
            <input type="text" id="user-story-title-input" placeholder="Untitled Story" style="padding: 8px; border-radius: 5px; border: 1px solid var(--input-border); background-color: var(--input-bg); color: var(--text-color); width: calc(100% - 16px);">
            <div class="button-group">
                <button id="user-story-title-confirm" class="action-button">Save</button>
                <button id="user-story-title-cancel" class="action-button cancel-button">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(inputModal);

    const titleInput = document.getElementById('user-story-title-input');
    const confirmBtn = document.getElementById('user-story-title-confirm');
    const cancelBtn = document.getElementById('user-story-title-cancel');

    return new Promise(resolve => {
        const cleanup = () => {
            document.body.removeChild(inputModal);
            resolve(false);
        };

        confirmBtn.onclick = async () => {
            const storyTitle = titleInput.value.trim() || 'Untitled Story';
            
            const newStory = {
                title: storyTitle,
                content: userStoryContent,
                summary: 'User-submitted story.',
                date: new Date().toLocaleString()
            };

            await saveStoryToLocalStorage(newStory);
            userStoryInput.value = '';
            userStoryInput.dispatchEvent(new Event('input'));
            showNotification('Your story has been saved!', 'success');
            displaySavedStories();
            showPage('my-stories-page');
            cleanup();
        };

        cancelBtn.onclick = cleanup;

        titleInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                confirmBtn.click();
            }
        });
    });
}


async function displaySavedStories() {
    savedStories = await loadStoriesFromLocalStorage();
    storiesList.innerHTML = ''; 
    
    if (savedStories.length === 0) {
        storiesList.innerHTML = '<p class="secondary-text">You have no saved stories yet.</p>';
        return;
    }

    savedStories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.classList.add('story-card');
        storyCard.innerHTML = `
            <h3>${story.title}</h3>
            <p class="secondary-text">Summary: ${story.summary}</p>
            <p class="secondary-text">Saved on: ${story.date}</p>
            <button class="action-button view-story-btn" data-id="${story.id}">View</button>
            <button class="action-button delete-story-btn" data-id="${story.id}">Delete</button>
        `;
        storiesList.appendChild(storyCard);
    });

    document.querySelectorAll('.view-story-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const storyId = event.target.dataset.id;
            viewStory(storyId);
        });
    });

    document.querySelectorAll('.delete-story-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const storyId = event.target.dataset.id;
            const confirmed = await showConfirmationModal("Are you sure you want to delete this story?");
            if (confirmed) {
                await deleteStoryFromLocalStorage(storyId);
                displaySavedStories();
            }
        });
    });
}

function viewStory(storyId) {
    const story = savedStories.find(s => s.id == storyId);
    if (story) {
        storyDisplay.textContent = story.content;
        storyTitleEl.textContent = story.title;
        storySummaryEl.textContent = story.summary;
        storyDisplay.style.display = 'block';
        comicPanelsContainer.style.display = 'none';
        storyIllustrations.style.display = 'none';
        showPage('story-display-page');
        showNotification(`Viewing: ${story.title}`, 'info');
    }
}

async function translateStory() {
    const textToTranslate = storyDisplay.textContent.trim();
    const language = translateLanguageSelect.value;
    if (!textToTranslate || !language) {
        showNotification('Please select a language and have a story to translate.', 'error');
        return;
    }

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/translate-story`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textToTranslate, targetLanguage: language })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Failed to translate story.");
        }

        await typewriterEffect(result.translatedText, storyDisplay);
        showNotification('Story translated!', 'success');
    } catch (error) {
        console.error('Translation error:', error);
        showNotification('Translation failed. Please check the backend.', 'error');
    }
}

async function copyStory() {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = storyDisplay.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Story copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy story:', err);
        showNotification('Failed to copy story.', 'error');
    }
}

function updateTtsButtons(state) {
    playTtsBtn.disabled = (state === 'playing');
    pauseTtsBtn.disabled = (state !== 'playing');
    stopTtsBtn.disabled = (state === 'initial');
}

function exportToPdf() {
    const storyTitle = storyTitleEl.textContent;
    const storyContent = storyDisplay.textContent;

    if (!storyContent) {
        showNotification('No story to export!', 'error');
        return;
    }

    const doc = new jspdf.jsPDF();
    doc.setFontSize(22);
    doc.text(storyTitle, 15, 20);
    doc.setFontSize(12);

    const splitText = doc.splitTextToSize(storyContent, 180);
    doc.text(splitText, 15, 30);
    
    doc.save(`${storyTitle}.pdf`);
    showNotification('Story exported as PDF!', 'success');
}

async function exportToDocx() {
    const storyTitle = storyTitleEl.textContent;
    const storyContent = storyDisplay.textContent;

    if (!storyContent) {
        showNotification('No story to export!', 'error');
        return;
    }

    const doc = new docx.Document({
        sections: [{
            children: [
                new docx.Paragraph({
                    text: storyTitle,
                    heading: docx.HeadingLevel.TITLE,
                }),
                new docx.Paragraph({
                    text: storyContent,
                    spacing: { after: 120 },
                }),
            ],
        }],
    });

    try {
        const blob = await docx.Packer.toBlob(doc);
        saveAs(blob, `${storyTitle}.docx`);
        showNotification('Story exported as DOCX!', 'success');
    } catch (error) {
        console.error('DOCX export error:', error);
        showNotification('Failed to export DOCX.', 'error');
    }
}

async function generateStoryImage() {
    const imagePrompt = imagePromptInput.value.trim();
    if (!imagePrompt) {
        showNotification('Please enter a prompt!', 'error');
        return;
    }

    const style = styleSelect.value;
    const aspectRatio = aspectRatioSelect.value;
    const resolution = resolutionSelect.value;
    const variationsCount = parseInt(variationsCountSelect.value, 10);
    const styleTransfer = styleTransferInput.value.trim();
    
    savePrompt('image', imagePrompt);

    imageLoadingSection.style.display = 'block';
    generateImageBtn.disabled = true;
    generatedImageContainer.innerHTML = '';
    generatedImageContainer.style.display = 'flex';

    try {
        const imagePromises = Array.from({ length: variationsCount }, (_, i) => {
            const seed = Date.now() + i;
            return fetch(`${PROXY_SERVER_URL}/generate-image`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    prompt: imagePrompt, 
                    style: style, 
                    aspectRatio: aspectRatio, 
                    resolution: resolution, 
                    styleTransfer: styleTransfer, 
                    seed: seed
                })
            }).then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(new Error(err.error || `Image generation failed with status ${response.status}`)));
                }
                return response.json();
            });
        });
        
        const results = await Promise.all(imagePromises);
        
        results.forEach(data => {
            if (data.url) {
                const imgElement = document.createElement('img');
                imgElement.src = data.url;
                imgElement.alt = "Generated Visual";
                imgElement.classList.add('generated-image-thumb');
                imgElement.style.maxWidth = 'calc(50% - 10px)';
                imgElement.style.height = 'auto';
                generatedImageContainer.appendChild(imgElement);
            } else {
                console.error("No image URL found in response:", data.error);
                showNotification("Some images failed to generate.", 'error');
            }
        });

        showNotification('Images generated successfully!', 'success');

    } catch (error) {
        console.error('Error generating images:', error);
        showNotification(`Failed to generate images: ${error.message}`, 'error');
    } finally {
        imageLoadingSection.style.display = 'none';
        generateImageBtn.disabled = false;
    }
}


async function runAILikenessScan() {
    const textToScan = aiScanInput.value.trim();
    if (!textToScan) {
        showNotification('Please enter text to scan!', 'error');
        return;
    }

    aiScanLoadingSection.style.display = 'block';
    runAiScanBtn.disabled = true;
    plagiarismCheckBtn.disabled = true;
    aiScanResult.style.display = 'none';
    plagiarismResult.style.display = 'none';

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/run-ai-scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textToScan })
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to get AI scan results from proxy.");
        }
        
        aiLikenessScore.textContent = `${result.score}%`;
        aiLikenessExplanation.textContent = result.explanation;
        aiScanResult.style.display = 'block';
        showNotification('AI likeness scan complete!', 'success');
    } catch (error) {
        console.error('Error running AI scan:', error);
        aiLikenessScore.textContent = '--';
        aiLikenessExplanation.textContent = 'Failed to run scan. Please try again.';
        aiScanResult.style.display = 'block';
        showNotification('Failed to run AI scan.', 'error');
    } finally {
        aiScanLoadingSection.style.display = 'none';
        runAiScanBtn.disabled = false;
        plagiarismCheckBtn.disabled = false;
    }
}

async function runPlagiarismCheck() {
    const textToCheck = aiScanInput.value.trim();
    if (!textToCheck) {
        showNotification('Please enter text to check for plagiarism!', 'error');
        return;
    }

    aiScanLoadingSection.style.display = 'block';
    plagiarismCheckBtn.disabled = true;
    runAiScanBtn.disabled = true;
    aiScanResult.style.display = 'none';
    plagiarismResult.style.display = 'none';

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/plagiarism-check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ textToCheck })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to get plagiarism check results from proxy.");
        }

        plagiarismScore.textContent = `${result.plagiarismScore}%`;
        plagiarismExplanation.textContent = result.explanation;
        plagiarismResult.style.display = 'block';
        showNotification('Plagiarism check complete!', 'success');
    } catch (error) {
        console.error('Error running plagiarism check:', error);
        plagiarismScore.textContent = '--';
        plagiarismExplanation.textContent = 'Failed to run plagiarism check. Ensure backend is running and Copyleaks API key/email are valid.';
        plagiarismResult.style.display = 'block';
        showNotification('Failed to run plagiarism check.', 'error');
    } finally {
        aiScanLoadingSection.style.display = 'none';
        plagiarismCheckBtn.disabled = false;
        runAiScanBtn.disabled = false;
    }
}

async function generateWorldBuilding() {
    const prompt = worldBuildingInput.value.trim();
    if (!prompt) {
        showNotification('Please enter a prompt for your world.', 'error');
        return;
    }

    worldBuildingLoadingSection.style.display = 'block';
    generateWorldBtn.disabled = true;
    worldBuildingDisplay.textContent = '';
    
    try {
        const response = await fetch(`${PROXY_SERVER_URL}/generate-world-building`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to generate world from proxy.");
        }

        await typewriterEffect(result.worldContent, worldBuildingDisplay);
        showNotification('World-building generated successfully!', 'success');

    } catch (error) {
        console.error('Error generating world:', error);
        showNotification('Failed to generate world. Check your backend and API key.', 'error');
    } finally {
        worldBuildingLoadingSection.style.display = 'none';
        generateWorldBtn.disabled = false;
    }
}

async function runPlotOutliner() {
    const text = plotOutlinerInput.value.trim();
    if (!text) {
        showNotification('Please enter text or a story idea for the plot outline.', 'error');
        return;
    }

    plotOutlinerLoadingSection.style.display = 'block';
    generatePlotBtn.disabled = true;
    plotOutlinerResult.style.display = 'none';

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/plot-outliner`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to generate plot outline from proxy.");
        }

        await typewriterEffect(result.plotOutline, plotOutlinerResult);
        plotOutlinerResult.style.display = 'block';
        showNotification('Plot outline generated!', 'success');
    } catch (error) {
        console.error('Error generating plot outline:', error);
        plotOutlinerResult.textContent = 'Failed to generate plot outline. Please try again.';
        plotOutlinerResult.style.display = 'block';
        showNotification('Failed to generate plot outline.', 'error');
    } finally {
        plotOutlinerLoadingSection.style.display = 'none';
        generatePlotBtn.disabled = false;
    }
}

async function generateDialogue() {
    const context = dialogueContextInput.value.trim();
    const instruction = dialogueInstructionInput.value.trim();

    if (!context || !instruction) {
        showNotification('Please provide both context and an instruction for the dialogue.', 'error');
        return;
    }

    dialogueWriterLoadingSection.style.display = 'block';
    generateDialogueBtn.disabled = true;
    dialogueWriterResult.style.display = 'none';

    try {
        const response = await fetch(`${PROXY_SERVER_URL}/dialogue-writer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ context, instruction })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to generate dialogue from proxy.");
        }

        await typewriterEffect(result.dialogue, dialogueWriterResult);
        dialogueWriterResult.style.display = 'block';
        showNotification('Dialogue generated!', 'success');
    } catch (error) {
        console.error('Error generating dialogue:', error);
        dialogueWriterResult.textContent = 'Failed to generate dialogue. Please try again.';
        dialogueWriterResult.style.display = 'block';
        showNotification('Failed to generate dialogue.', 'error');
    } finally {
        dialogueWriterLoadingSection.style.display = 'none';
        generateDialogueBtn.disabled = false;
    }
}

function savePrompt(type, promptText) {
    let prompts = JSON.parse(localStorage.getItem(`${type}Prompts`)) || [];
    if (prompts.length > 0 && prompts[0].text === promptText) {
        return;
    }
    prompts.unshift({ text: promptText, date: new Date().toLocaleString() });
    if (prompts.length > 10) {
        prompts = prompts.slice(0, 10);
    }
    localStorage.setItem(`${type}Prompts`, JSON.stringify(prompts));
    displayPromptHistory(type);
}

function displayPromptHistory(type) {
    const container = type === 'story' ? storyPromptHistory : imagePromptHistory;
    const prompts = JSON.parse(localStorage.getItem(`${type}Prompts`)) || [];
    container.innerHTML = '';

    if (prompts.length === 0) {
        container.innerHTML = '<p class="secondary-text">No history yet.</p>';
        return;
    }

    prompts.forEach(prompt => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <p class="history-text">${prompt.text}</p>
            <p class="secondary-text">${prompt.date}</p>
            <button class="action-button use-prompt-btn" data-type="${type}" data-text="${prompt.text}">Use</button>
        `;
        container.appendChild(historyItem);
    });

    document.querySelectorAll('.use-prompt-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const text = e.target.dataset.text;
            if (type === 'story') {
                storyInput.value = text;
                storyInput.dispatchEvent(new Event('input'));
            } else if (type === 'image') {
                imagePromptInput.value = text;
                imagePromptInput.dispatchEvent(new Event('input'));
            }
            showNotification('Prompt loaded!', 'info');
        });
    });
}
