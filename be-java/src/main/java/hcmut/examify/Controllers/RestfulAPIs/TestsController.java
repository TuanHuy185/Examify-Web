package hcmut.examify.Controllers.RestfulAPIs;

import hcmut.examify.Services.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import hcmut.examify.DTOs.QuestionDTO;
import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.DTOs.TestsDTO;
import hcmut.examify.Services.TestsService;

@RestController
@RequestMapping("/tests")
public class TestsController {
    @Autowired
    private TestsService testsService;
    @Autowired
    private ResultService resultService;

    @GetMapping
    public ResponseEntity<ResponseObject> getAllTests(@RequestParam("teacherId") Integer teacherId) {
        return testsService.FNC_getAllTests(teacherId);
    }

    @GetMapping("/{testId}")
    public ResponseEntity<ResponseObject> getTestById(
        @PathVariable Integer testId,
        @RequestParam("teacherId") Integer teacherId) {
        return testsService.FNC_getTestById(teacherId, testId);
    }

    @PostMapping
    public ResponseEntity<ResponseObject> addTest(@RequestBody TestsDTO testsDTO){
        return testsService.PROC_createTest(testsDTO);
    }

    @PutMapping
    public ResponseEntity<ResponseObject> updateTest(@RequestBody TestsDTO testsDTO){
        return testsService.PROC_updateTest(testsDTO);
    }

    @DeleteMapping("/{testId}")
    public ResponseEntity<ResponseObject> deleteTest(@PathVariable Integer testId){
        return testsService.PROC_deleteTest(testId);
    }

    @GetMapping("/{testId}/results")
    public ResponseEntity<ResponseObject> getAllResults(@PathVariable Integer testId) {
        return resultService.FNC_getAllTestResults(testId);
    }

    @GetMapping("/{testId}/students/{studentId}/results")
    public ResponseEntity<ResponseObject> getResultByStudentIdAndTestId(@PathVariable Integer testId, @PathVariable Integer studentId) {
        return resultService.FNC_getResultByStudentIdAndTestId(testId, studentId);
    }
}
