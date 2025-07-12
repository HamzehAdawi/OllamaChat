function loadPrismAssets() {
    const head = document.head;

    const prismCss = document.createElement("link");
    prismCss.rel = "stylesheet";
    prismCss.href = "https://cdn.jsdelivr.net/npm/prismjs/themes/prism.css";
    head.appendChild(prismCss);

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            head.appendChild(script);
        });
    }

    return loadScript("https://cdn.jsdelivr.net/npm/prismjs/prism.js").then(() =>
        Promise.all([
            loadScript("https://cdn.jsdelivr.net/npm/prismjs/components/prism-javascript.min.js"),
            loadScript("https://cdn.jsdelivr.net/npm/prismjs/components/prism-json.min.js")
        ])
    );
}

function showLoader() {
    const loadingDots = document.getElementById("loading-dots");
    if (loadingDots) {
        loadingDots.style.display = "flex";
    }
    return true;
}

function highlightInlineCode() {
    const chatContainer = document.getElementById("chat");
    if (!chatContainer) return;

    const messages = chatContainer.querySelectorAll(".message");

    messages.forEach((msg) => {
        const nodes = Array.from(msg.childNodes);

        nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue.trim();

                // Try parsing JSON only if it looks valid
                if (isJsonCandidate(text)) {
                    try {
                        const jsonObj = JSON.parse(text);
                        if (typeof jsonObj === "object" && jsonObj !== null) {
                            const prettyJson = JSON.stringify(jsonObj, null, 2);

                            const pre = document.createElement("pre");
                            const code = document.createElement("code");
                            code.className = "language-json";
                            code.textContent = prettyJson;

                            pre.appendChild(code);
                            msg.replaceChild(pre, node);
                            return;
                        }
                    } catch (e) {
                        // Silently ignore JSON parsing errors
                    }
                }

                // Markdown-style inline/block code
                if (text.includes("`")) {
                    const parts = splitMarkdownCodeBlocks(text);
                    const fragment = document.createDocumentFragment();
                    let hasCode = false;

                    parts.forEach((part) => {
                        if (part.type === "inline") {
                            const code = document.createElement("code");
                            code.className = "language-javascript";
                            code.textContent = part.content;
                            fragment.appendChild(code);
                            hasCode = true;
                        } else if (part.type === "block") {
                            const pre = document.createElement("pre");
                            const code = document.createElement("code");
                            code.className = "language-javascript";
                            code.textContent = part.content;
                            pre.appendChild(code);
                            fragment.appendChild(pre);
                            hasCode = true;
                        } else {
                            fragment.appendChild(document.createTextNode(part.content));
                        }
                    });

                    if (hasCode) {
                        msg.replaceChild(fragment, node);
                    }
                }
            }
        });
    });
}

function isJsonCandidate(str) {
    if (!str) return false;
    str = str.trim();
    return (
        (str.startsWith("{") && str.endsWith("}")) ||
        (str.startsWith("[") && str.endsWith("]"))
    );
}

function splitMarkdownCodeBlocks(text) {
    const parts = [];
    let index = 0;
    const regex = /```(\w+)?\n([\s\S]*?)```|`([^`\n]+)`/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
        const matchStart = match.index;
        const matchEnd = regex.lastIndex;

        if (matchStart > index) {
            parts.push({ type: "text", content: text.slice(index, matchStart) });
        }

        if (match[2]) {
            parts.push({ type: "block", content: match[2].trim() });
        } else if (match[3]) {
            parts.push({ type: "inline", content: match[3].trim() });
        }

        index = matchEnd;
    }

    if (index < text.length) {
        parts.push({ type: "text", content: text.slice(index) });
    }

    return parts;
}

window.addEventListener("load", function () {
    const loadingDots = document.getElementById("loading-dots");
    if (loadingDots) {
        loadingDots.style.display = "none";
    }

    const chat = document.getElementById("chat");
    if (chat) {
        chat.scrollTop = chat.scrollHeight;
    }

    const textarea = document.getElementById("input");
    if (textarea) {
        textarea.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                showLoader();
                this.form.submit();
            }
        });
    }

    loadPrismAssets()
        .then(() => {
            setTimeout(() => {
                highlightInlineCode();
                Prism.highlightAll();
            }, 50);
        })
        .catch((err) => {
            console.error("Failed to load Prism.js:", err);
        });
});
