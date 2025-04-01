package hcmut.examify.Controllers.RestfulAPIs;

import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.Services.AnswerService;
import hcmut.examify.Services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tests/{testId}/questions/{questionId}/answers")
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    @GetMapping
    public ResponseEntity<ResponseObject> FNC_getAllAnswers(@PathVariable Integer questionId) {
        return answerService.FNC_getAllAnswers(questionId);
    }
}
