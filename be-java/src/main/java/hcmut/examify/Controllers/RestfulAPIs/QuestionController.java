package hcmut.examify.Controllers.RestfulAPIs;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.Services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tests/{testId}/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<ResponseObject> FNC_getAllQuestions(@PathVariable Integer testId) {
        return questionService.FNC_getAllQuestions(testId);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<ResponseObject> FNC_getQuestionById(
            @PathVariable Integer testId,
            @PathVariable Integer questionId) {
        return questionService.FNC_getQuestionById(testId, questionId);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<ResponseObject> PROC_deleteQuestionById(@PathVariable Integer questionId) {
        return questionService.PROC_deleteQuestionById(questionId);
    }
}