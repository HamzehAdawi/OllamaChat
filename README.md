
# OllamaUI

**OllamaUI** is a Java Spring Boot, Spring AI web app with a Thymeleaf frontend that lets users chat with Locally hosted Ollama large language models. It supports dynamic model selection via Spring AI and configuration properties for easy switching. Featuring a clean UI and seamless local API integration, it delivers an intuitive and flexible AI chat experience.

---
## Demo

---<img width="2160" height="1247" alt="OllamaDemo" src="https://github.com/user-attachments/assets/66af320c-6481-430f-8ade-b65ca60ba1e1" />


## Features

- Chat interface powered by LOCALLY hosted Ollama LLM backend  
- Dynamic model selection via configuration properties  
- Clean UI built with Thymeleaf and CSS  
- Real-time chat with loading indicator  
- Simple setup with Spring Boot  

---

## Getting Started

### Prerequisites

- Java 17 or higher  
- Maven or Gradle build tool  
- Ollama installed locally (see instructions below)  
- Ollama models downloaded and available locally  

### Installing Ollama and Models

1. Download and install Ollama from the official website (LOCALLY hosted):  
   https://ollama.com  

2. Verify installation by running in your terminal/command prompt:  
   ```
   ollama version
   ```

3. To list available models, run:  
   ```
   ollama list
   ```

4. To pull/download a model, run:  
   ```
   ollama pull <model-name>
   ```  
   Example:  
   ```
   ollama pull llama3
   ```

5. Make sure Ollama’s local API is running on default port 11434. Usually it runs automatically after installation. You can check with:  
   ```
   ollama status
   ```

### Running the App

1. Clone the repository:  
   ```
   git clone https://github.com/HamzehAdawi/OllamaUI.git
   cd OllamaUI
   ```

2. Build and run with Maven:  
   ```
   mvn spring-boot:run
   ```

3. Open your browser at http://localhost:8080 to start chatting.

---

## Changing the Ollama Model

OllamaUI lets you switch between different Ollama LLM models easily without changing any code.

**How to change the model:**

1. Open the `src/main/resources/application.properties` file.

2. Locate the property:  
   ```
   spring.ai.ollama.chat.model=llama3
   ```

3. Change the value (`llama3`) to any supported Ollama model you want to use, for example:  
   ```
   spring.ai.ollama.chat.model=llama2
   ```

4. Save the file.

5. Restart the Spring Boot application to apply the new model:  
   ```
   mvn spring-boot:run
   ```

The app will now use the updated model for all chat interactions.

---

## Project Structure

- `controllers/` — Spring MVC controllers handling web requests  
- `services/` — Business logic and Ollama API integration  
- `config/` — Configuration classes (e.g., model property injection)  
- `entities/` — Data entities like messages  
- `resources/templates/` — Thymeleaf HTML templates  
- `resources/static/` — Static assets (CSS, images)  

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

Hamzeh Adawi —  
🤖 Enjoy chatting with Ollama!  🤖


---

 
