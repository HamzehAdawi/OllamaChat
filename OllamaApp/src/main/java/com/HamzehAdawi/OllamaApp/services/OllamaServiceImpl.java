package com.HamzehAdawi.OllamaApp.services;

import com.HamzehAdawi.OllamaApp.tools.DateTimeTools;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OllamaServiceImpl implements OllamaService {

    private final ChatClient chatClient;

    @Autowired
    public OllamaServiceImpl(ChatClient.Builder builder) {
        ChatMemory memory = MessageWindowChatMemory.builder()
                .maxMessages(10)
                .build();

        MessageChatMemoryAdvisor advisor = MessageChatMemoryAdvisor.builder(memory).build();

        this.chatClient = builder
                .defaultAdvisors(advisor)
                .build();
    }

    public String chat(String userInput) {
        // Start the prompt builder
        var prompt = chatClient.prompt()
                .system("You are a helpful assistant. Respond in natural language. Prefer plain code blocks for coding questions.")
                .user(userInput);

        // Only inject the date tool if the prompt looks like a date/time question
        if (mentionsDateTime(userInput)) {
            prompt = prompt.tools(new DateTimeTools());
        }

        // Get the result
        String response = prompt.call().content();

        // Optional: fallback if it looks like malformed tool JSON
        if (isBrokenToolCallResponse(response)) {
            return "I'm trying to generate code, but something may have interfered. Please rephrase your request.";
        }

        return response;
    }

    private boolean mentionsDateTime(String input) {
        String lower = input.toLowerCase();
        return lower.contains("date") || lower.contains("time") || lower.contains("timezone");
    }

    private boolean isBrokenToolCallResponse(String response) {
        return response != null && response.contains("generateCode") && response.contains("parameters");
    }
}

