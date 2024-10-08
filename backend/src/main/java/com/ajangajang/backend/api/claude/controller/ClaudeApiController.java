package com.ajangajang.backend.api.claude.controller;

import com.ajangajang.backend.api.claude.model.service.ClaudeApi;
import com.ajangajang.backend.api.claude.dto.PromptConditionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ClaudeApiController {

    private final ClaudeApi claudeApi;

    @PostMapping("/api/claude")
    public ResponseEntity<?> getBoardContent(@RequestBody PromptConditionDto condition) {
        Map<String, String> result = claudeApi.callClaudeApi(condition);
        return ResponseEntity.ok(result);
    }

}
