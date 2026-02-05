package com.aiflow.controller;

import com.aiflow.dto.AnswerRequest;
import com.aiflow.dto.AnswerResponse;
import com.aiflow.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {
    
    private final AiService aiService;
    
    @PostMapping("/generate")
    public ResponseEntity<AnswerResponse> generateAnswer(@RequestBody AnswerRequest request) {
        try {
            String answer = aiService.generateAnswer(request.getQuestion());
            return ResponseEntity.ok(new AnswerResponse(answer));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new AnswerResponse("오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Spring AI Server is running");
    }
}
