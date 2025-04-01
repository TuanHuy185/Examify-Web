package hcmut.examify.Services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import hcmut.examify.DTOs.ChangePasswordDTO;
import hcmut.examify.DTOs.NewAccountDTO;
import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.DTOs.UpdateAccountDTO;

@Service
public class UserService {
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    public UserService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public ResponseEntity<ResponseObject> PROC_addUser(NewAccountDTO newAccount) {
        try {
            jdbcTemplate.execute(
            "CALL add_user(?, ?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setString(1, newAccount.getUsername());
                ps.setString(2, passwordEncoder.encode(newAccount.getPassword()));
                ps.setString(3, newAccount.getRole());
 
                ps.execute();
                return null;
            }
        );
            return ResponseEntity.status(HttpStatus.OK)
                .body(new ResponseObject("OK", "Query to update PROC_addUser() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_addUser(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> PROC_updateUserInfor(UpdateAccountDTO updateAccount, Integer userId) {
        try {
            jdbcTemplate.execute(
            "CALL update_user_infor(?, ?, ?, ?)",
            (PreparedStatementCallback<Void>) ps -> {
                ps.setInt(1, userId);
                ps.setString(2, updateAccount.getName());
                ps.setString(3, updateAccount.getEmail());
                ps.setDate(4, updateAccount.getDob());
 
                    ps.execute();
                    return null;
                }
            );
                return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to update PROC_updateUserInfor() successfully", null));
            } catch (DataAccessException e) {
                // Xử lý lỗi liên quan đến truy cập dữ liệu
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
            } catch (Exception e) {
                // Xử lý các lỗi khác
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error updating PROC_updateUserInfor(): " + e.getMessage(), null));
            }
        }

        public ResponseEntity<ResponseObject> PROC_changePassword(ChangePasswordDTO changePasswordDTO) {
            try {
                jdbcTemplate.execute(
                "CALL change_password(?, ?, ?)",
                (PreparedStatementCallback<Void>) ps -> {
                    ps.setString(1, changePasswordDTO.getUsername());
                    ps.setString(2, passwordEncoder.encode(changePasswordDTO.getOldPassword()));
                    ps.setString(3, passwordEncoder.encode(changePasswordDTO.getNewPassword()));

                    ps.execute();
                    return null;
                }
            );
                return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to update PROC_changePassword() successfully", null));
        } catch (DataAccessException e) {
            // Xử lý lỗi liên quan đến truy cập dữ liệu
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Database error: " + e.getMessage(), null));
        } catch (Exception e) {
            // Xử lý các lỗi khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseObject("ERROR", "Error updating PROC_changePassword(): " + e.getMessage(), null));
        }
    }

    public ResponseEntity<ResponseObject> FNC_getUserInfo(Integer userId) {
        try {
            String userInfo = jdbcTemplate.queryForObject(
                    "SELECT get_user_infor(?)",
                    String.class, userId
            );
            if (userInfo == null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new ResponseObject("OK", "Query to get FNC_getUserInfo() successfully with data = null", userInfo));
            }

            JsonNode jsonNode = objectMapper.readTree(userInfo);

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to get FNC_getUserInfo() successfully", jsonNode));
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
                    .body(new ResponseObject("ERROR", "Error getting FNC_getUserInfo(): " + e.getMessage(), null));
        }
    }

}
