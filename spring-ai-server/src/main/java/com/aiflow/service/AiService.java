package com.aiflow.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {
    
    // Spring AI의 ChatModel 사용
    // ChatModel을 통해 OpenAI API 호출 (Spring AI의 추상화 레이어)
    private final ChatModel chatModel;
    
    public String generateAnswer(String question) {
        log.info("질문 수신: {}", question);
        
        // Spring AI를 사용하여 답변 생성
        Prompt prompt = new Prompt(new UserMessage(question));
        ChatResponse response = chatModel.call(prompt);
        
        String answer = response.getResult().getOutput().getContent();
        log.info("답변 생성 완료: {}", answer.substring(0, Math.min(100, answer.length())));
        
        return answer;
    }
}
