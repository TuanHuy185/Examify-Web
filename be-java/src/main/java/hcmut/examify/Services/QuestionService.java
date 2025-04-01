package hcmut.examify.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hcmut.examify.DTOs.ResponseObject;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public QuestionService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    public ResponseEntity<ResponseObject> FNC_getAllQuestions(Integer testId) {
        try {
            String questions = jdbcTemplate.queryForObject(
                    "SELECT get_all_question_of_test(?)",
                    String.class, testId
            );
            if (questions == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getAllQuestions() successfully with data = null", questions));
            }

            JsonNode jsonNode = objectMapper.readTree(questions);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getAllQuestions() successfully", jsonNode));
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
                    .body(new ResponseObject("ERROR", "Error getting FNC_getAllQuestions(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getQuestionById(Integer testId, Integer questionId) {
        try {
            String question = jdbcTemplate.queryForObject(
                    "SELECT get_question_of_test_by_questionID(?, ?)",
                    String.class, testId, questionId
            );
            if (question == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getQuestionById() successfully with data = null", question));
            }

            JsonNode jsonNode = objectMapper.readTree(question);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getQuestionById() successfully", jsonNode));
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
                    .body(new ResponseObject("ERROR", "Error getting FNC_getQuestionById(): " + e.getMessage(), null));
        }
    }


    public ResponseEntity<ResponseObject> PROC_deleteQuestionById(Integer questionId) {
        try {
            jdbcTemplate.execute(
                    "CALL delete_question(?)",
                    (PreparedStatementCallback<Void>) ps -> {
                        ps.setInt(1, questionId);

                        ps.execute();
                        return null;
                    }
            );
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to update PROC_deleteQuestionById() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error updating PROC_deleteQuestionById(): " + e.getMessage(), null));
        }
    }
}
