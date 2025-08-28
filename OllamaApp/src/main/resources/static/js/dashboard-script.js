
    function loadPrismAssets() {
    const head = document.head;

    // Prism CSS
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
    loadScript("https://cdn.jsdelivr.net/npm/prismjs/components/prism-json.min.js"),
    loadScript("https://cdn.jsdelivr.net/npm/prismjs/plugins/line-numbers/prism-line-numbers.min.js")
    ])
    );
}

    function showLoader() {
    const loadingDots = document.getElementById("loading-dots");
    if (loadingDots) loadingDots.style.display = "flex";
    return true;
}

    function autoLinkify(msg) {
    msg.innerHTML = msg.innerHTML.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );
}

    function highlightInlineCode() {
    const chatContainer = document.getElementById("chat");
    if (!chatContainer) return;

    const messages = chatContainer.querySelectorAll(".message");

    messages.forEach((msg) => {
    autoLinkify(msg); // make links clickable

    const nodes = Array.from(msg.childNodes);

    nodes.forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;

    const text = node.nodeValue.trim();
    if (!text) return;

    // JSON detection
    if (isJsonCandidate(text)) {
    try {
    const jsonObj = JSON.parse(text);
    if (typeof jsonObj === "object" && jsonObj !== null) {
    const prettyJson = JSON.stringify(jsonObj, null, 2);

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-json line-numbers";
    code.textContent = prettyJson;

    pre.appendChild(code);
    msg.replaceChild(pre, node);
    makeCollapsible(pre);
    return;
}
} catch (e) {}
}

    // Markdown-style code blocks
    if (text.includes("`")) {
    const parts = splitMarkdownCodeBlocks(text);
    const fragment = document.createDocumentFragment();
    let hasCode = false;

    parts.forEach((part) => {
    if (part.type === "inline") {
    const code = document.createElement("code");
    code.className = `language-${part.lang || "javascript"}`;
    code.textContent = part.content;
    fragment.appendChild(code);
    hasCode = true;
} else if (part.type === "block") {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = `language-${part.lang || "javascript"} line-numbers`;
    code.textContent = part.content;
    pre.appendChild(code);
    fragment.appendChild(pre);
    makeCollapsible(pre);
    hasCode = true;
} else {
    fragment.appendChild(document.createTextNode(part.content));
}
});

    if (hasCode) msg.replaceChild(fragment, node);
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
    parts.push({ type: "block", content: match[2].trim(), lang: match[1] });
} else if (match[3]) {
    parts.push({ type: "inline", content: match[3].trim(), lang: "javascript" });
}

    index = matchEnd;
}

    if (index < text.length) {
    parts.push({ type: "text", content: text.slice(index) });
}

    return parts;
}

    function makeCollapsible(pre) {
    const maxHeight = 300; // px
    if (pre.scrollHeight > maxHeight) {
    pre.style.maxHeight = maxHeight + "px";
    pre.style.overflow = "hidden";

    const toggle = document.createElement("button");
    toggle.textContent = "Show More ▼";
    toggle.style.display = "block";
    toggle.style.marginTop = "4px";
    toggle.style.cursor = "pointer";

    toggle.addEventListener("click", () => {
    if (pre.style.maxHeight) {
    pre.style.maxHeight = "";
    pre.style.overflow = "";
    toggle.textContent = "Show Less ▲";
} else {
    pre.style.maxHeight = maxHeight + "px";
    pre.style.overflow = "hidden";
    toggle.textContent = "Show More ▼";
}
});

    pre.parentNode.insertBefore(toggle, pre.nextSibling);
}
}

    function addCopyButtons() {
    document.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".copy-btn")) return; // avoid duplicates

        const button = document.createElement("button");
        button.textContent = "📋 Copy";
        button.className = "copy-btn";
        button.style.position = "absolute";
        button.style.top = "6px";
        button.style.right = "6px";
        button.style.padding = "2px 6px";
        button.style.fontSize = "12px";
        button.style.cursor = "pointer";

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.appendChild(button);

        // move the <pre> inside wrapper
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        button.addEventListener("click", async () => {
            const code = pre.querySelector("code").innerText;
            try {
                await navigator.clipboard.writeText(code);
                button.textContent = "✅ Copied!";
                setTimeout(() => (button.textContent = "📋 Copy"), 1500);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        });
    });
}

    window.addEventListener("load", () => {
    const loadingDots = document.getElementById("loading-dots");
    if (loadingDots) loadingDots.style.display = "none";

    const chat = document.getElementById("chat");
    if (chat) chat.scrollTop = chat.scrollHeight;

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
    addCopyButtons();
}, 50);
})
    .catch((err) => {
    console.error("Failed to load Prism.js:", err);
});
});
