package hcmut.examify.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hcmut.examify.DTOs.CreateResultDTO;
import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.DTOs.UpdateResultDTO;
import org.hibernate.sql.Update;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ResultService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;


    public ResultService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<ResponseObject> FNC_getAllTestResults(Integer testId) {
        try {
            String testResults = jdbcTemplate.queryForObject(
                    "SELECT get_all_student_result(?)",
                    String.class, testId
            );

            if (testResults == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getAllTestResults() successfully with data = null", null));
            }

            JsonNode jsonNode = objectMapper.readTree(testResults);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getAllTestResults() successfully", jsonNode));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error getting FNC_getAllTestResults(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getAllResultsByStudentId(Integer studentId) {
        try {
            String resultsOfStudent = jdbcTemplate.queryForObject(
                    "SELECT get_results_of_student(?)",
                    String.class, studentId
            );

            if (resultsOfStudent == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getAllResultsByStudentId() successfully with data = null", null));
            }

            JsonNode jsonNode = objectMapper.readTree(resultsOfStudent);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getAllResultsByStudentId() successfully", jsonNode));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error getting FNC_getAllResultsByStudentId(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getResultByStudentIdAndTestId(Integer testId, Integer studentId) {
        try {
            String studentTestResult = jdbcTemplate.queryForObject(
                    "SELECT get_result_by_student_id_and_test_id(?, ?)",
                    String.class, studentId, testId
            );

            if (studentTestResult == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getResultByStudentIdAndTestId() successfully with data = null", null));
            }

            JsonNode jsonNode = objectMapper.readTree(studentTestResult);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getResultByStudentIdAndTestId() successfully", jsonNode));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "JSON processing error: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error getting FNC_getResultByStudentIdAndTestId(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_createResult(CreateResultDTO resultDTO) {
        try {
            // Định dạng timestamp
            DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_DATE_TIME;
            DateTimeFormatter sqlFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            // Chuyển đổi startTime
            LocalDateTime startTime = LocalDateTime.parse(resultDTO.getStartTime(), isoFormatter);
            String formattedStartTime = startTime.format(sqlFormatter);

            // Gọi procedure bằng cú pháp đơn giản hơn
            jdbcTemplate.execute(
                    "CALL create_result(?, ?, ?)",
                    (PreparedStatementCallback<Void>) ps -> {
                        ps.setInt(1, resultDTO.getStudentId());
                        ps.setInt(2, resultDTO.getTestId());
                        ps.setTimestamp(3, Timestamp.valueOf(formattedStartTime));

                        // Đăng ký tham số OUT
                        ps.execute();

                        return null;
                    }
            );

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Result created successfully", null));
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error creating result: " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_updateResult(UpdateResultDTO resultDTO) {
        try {
            if (resultDTO.getStudentId() == null || resultDTO.getTestId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseObject("ERROR", "Student ID and Test ID are required", null));
            }

            System.out.println("result:" + resultDTO);

            DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_DATE_TIME;
            DateTimeFormatter sqlFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            LocalDateTime endTime = LocalDateTime.parse(resultDTO.getEndTime(), isoFormatter);
            String formattedEndTime = endTime.format(sqlFormatter);

            jdbcTemplate.execute(
                    "CALL update_result(?, ?, ?)",
                    (PreparedStatementCallback<Void>) ps -> {
                        ps.setInt(1, resultDTO.getStudentId());
                        ps.setInt(2, resultDTO.getTestId());
                        ps.setTimestamp(3, Timestamp.valueOf(formattedEndTime));

                        ps.execute();

                        return null;
                    }
            );

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Result updated successfully", null));
        } catch (DataAccessException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error updating result: " + e.getMessage(), null));
        }
    }
}
