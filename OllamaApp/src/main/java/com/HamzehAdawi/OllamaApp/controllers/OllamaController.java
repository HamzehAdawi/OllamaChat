package com.HamzehAdawi.OllamaApp.controllers;

import com.HamzehAdawi.OllamaApp.config.AppConfig;
import com.HamzehAdawi.OllamaApp.services.MessagesServiceImpl;
import com.HamzehAdawi.OllamaApp.services.OllamaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/")
@Controller()
public class OllamaController {

    private final OllamaServiceImpl ollamaServiceImpl;
    private final MessagesServiceImpl messagesServiceImpl;
    private final AppConfig appConfig;

    @Autowired
    public OllamaController(OllamaServiceImpl ollamaServiceImpl, MessagesServiceImpl messagesServiceImpl,  AppConfig appConfig) {
        this.ollamaServiceImpl = ollamaServiceImpl;
        this.messagesServiceImpl = messagesServiceImpl;
        this.appConfig = appConfig;
    }

    @GetMapping()
    public String homePage(Model model) {
        model.addAttribute("ollamaModel", appConfig.getOllamaModel());
        ArrayList<String> list = new ArrayList<>();
        list.add("Ollama: "+ ollamaServiceImpl.chat("give a short, one sentence, friendly greeting."));
        model.addAttribute("messageList", list);
        return "dashboard";
    }
    @PostMapping()
    public String generate(Model model, @ModelAttribute("input") String input) {
        messagesServiceImpl.addUserMessage(input);
        messagesServiceImpl.addOllamaResponse(ollamaServiceImpl.chat(input));
        List<String> messageList = messagesServiceImpl.getConversation();
        model.addAttribute("messageList", messageList);
        model.addAttribute("ollamaModel", appConfig.getOllamaModel());
        return "dashboard";
    }
}
