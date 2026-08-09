const aiLauncher = document.getElementById("aiLauncher");
const aiWindow = document.getElementById("aiWindow");
const aiClose = document.getElementById("aiClose");

const aiMessages = document.getElementById("aiMessages");
const aiInput = document.getElementById("aiInput");
const aiSend = document.getElementById("aiSend");

const quickButtons = document.querySelectorAll(".ai-quick button");

let isSending = false;


// ================================
// OPEN / CLOSE
// ================================

aiLauncher.addEventListener("click", () => {
    aiWindow.classList.add("active");

    setTimeout(() => {
        aiInput.focus();
    }, 150);
});

aiClose.addEventListener("click", () => {
    aiWindow.classList.remove("active");
});


// ================================
// ADD MESSAGE
// ================================

function addMessage(text, type = "bot") {

    const wrapper = document.createElement("div");

    wrapper.className = `ai-message ${type}`;

    const bubble = document.createElement("div");

    bubble.className = "ai-bubble";

    bubble.textContent = text;

    wrapper.appendChild(bubble);

    aiMessages.appendChild(wrapper);

    scrollToBottom();

    return wrapper;
}


// ================================
// TYPING
// ================================

function showTyping() {

    const wrapper = document.createElement("div");

    wrapper.className = "ai-message bot";

    wrapper.id = "aiTypingMessage";

    wrapper.innerHTML = `
        <div class="ai-bubble">
            <div class="ai-typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    aiMessages.appendChild(wrapper);

    scrollToBottom();
}


function hideTyping() {

    const typing = document.getElementById("aiTypingMessage");

    if (typing) {
        typing.remove();
    }
}


// ================================
// SCROLL
// ================================

function scrollToBottom() {

    aiMessages.scrollTop = aiMessages.scrollHeight;
}


// ================================
// ZANTA AI4CHAT
// ================================

async function askZanta(message) {

    const apiKey =
        "zanta_jCYLhRZdLWNqnc8EUnfWQ3iI";

    const url =
        "https://api.zanta-mini.store/api/ai4chat?" +
        "apiKey=" +
        encodeURIComponent(apiKey) +
        "&text=" +
        encodeURIComponent(message);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(
            "API Error: " + response.status
        );
    }

    const data = await response.json();

    console.log("ZANTA RESPONSE:", data);

    if (!data) {
        throw new Error("Empty API response");
    }

    // Zanta common response
    if (data.result !== undefined) {

        if (typeof data.result === "object") {

            return (
                data.result.message ||
                data.result.text ||
                data.result.response ||
                JSON.stringify(data.result)
            );
        }

        return String(data.result);
    }

    if (data.response !== undefined) {
        return String(data.response);
    }

    if (data.message !== undefined) {
        return String(data.message);
    }

    if (data.text !== undefined) {
        return String(data.text);
    }

    return JSON.stringify(data);
}


// ================================
// SEND MESSAGE
// ================================

async function sendMessage(customText = null) {

    if (isSending) return;

    const text =
        customText ||
        aiInput.value.trim();

    if (!text) return;

    if (text.length > 2000) {

        addMessage(
            "⚠️ Please keep your message under 2000 characters.",
            "bot"
        );

        return;
    }

    isSending = true;

    aiSend.disabled = true;

    if (!customText) {
        aiInput.value = "";
    }

    addMessage(text, "user");

    showTyping();

    try {

        const answer = await askZanta(text);

        hideTyping();

        addMessage(
            answer || "I couldn't generate a response.",
            "bot"
        );

    } catch (error) {

        hideTyping();

        console.error("ZANTA AI ERROR:", error);

        addMessage(
            "⚠️ AI service is currently unavailable. Please try again.",
            "bot"
        );

    } finally {

        isSending = false;

        aiSend.disabled = false;

        aiInput.focus();
    }
}


// ================================
// SEND BUTTON
// ================================

aiSend.addEventListener("click", () => {

    sendMessage();

});


// ================================
// ENTER KEY
// ================================

aiInput.addEventListener("keydown", (event) => {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }

});


// ================================
// QUICK QUESTIONS
// ================================

quickButtons.forEach(button => {

    button.addEventListener("click", () => {

        const question =
            button.dataset.question;

        if (question) {

            sendMessage(question);

        }

    });

});


// ================================
// ESC CLOSE
// ================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        aiWindow.classList.remove("active");

    }

});


// ================================
// WELCOME MESSAGE
// ================================

window.addEventListener("DOMContentLoaded", () => {

    addMessage(
        "Hi! 👋 I'm Madusanka's AI Assistant. Ask me anything about Madusanka, his skills, projects, or website.",
        "bot"
    );

});
