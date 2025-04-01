package hcmut.examify.Services;

import hcmut.examify.DTOs.AnswerDTO;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.examify.DTOs.ResponseObject;

@Service
public class StudentService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;


    public StudentService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<ResponseObject> FNC_getTestInforByPasscode(String passcode) {
        try {
            String test = jdbcTemplate.queryForObject(
                    "SELECT get_test_by_passcode(?)",
                    String.class, passcode
            );
            if (test == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getTestInforByPasscode() successfully with data = null", test));
            }

            JsonNode jsonNode = objectMapper.readTree(test);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getTestInforByPasscode() successfully", jsonNode));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            // Xử lý lỗi khi parse JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error getting FNC_getTestInforByPasscode(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getStudentAnswer(Integer studentId, Integer questionId) {
        try {
            String studentAnswers = jdbcTemplate.queryForObject(
                    "SELECT get_studentAnswer(?, ?)",
                    String.class, studentId, questionId
            );
            if (studentAnswers == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getStudentAnswer() successfully with data = null", studentAnswers));
            }

            JsonNode jsonNode = objectMapper.readTree(studentAnswers);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getStudentAnswer() successfully", jsonNode));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            // Xử lý lỗi khi parse JSON
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error getting FNC_getStudentAnswer(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_createStudentAnswer(Integer studentId, Integer questionId){
        try {
            jdbcTemplate.execute(
            "CALL create_studentAnswer(?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setInt(1, studentId);
                ps.setInt(2, questionId);
 
                ps.execute();
                return null;
            }
        );
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_createStudentAnswer() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_createStudentAnswer(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_updateStudentAnswer(Integer studentId, Integer questionId, Integer answerId){
        try {
            jdbcTemplate.execute(
            "CALL update_studentAnswer(?, ?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setInt(1, studentId);
                ps.setInt(2, questionId);
                ps.setInt(3, answerId);
 
                ps.execute();
                return null;
            }
        );
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_updateStudentAnswer() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_updateStudentAnswer(): " + e.getMessage(), null));
        }
    }
}
