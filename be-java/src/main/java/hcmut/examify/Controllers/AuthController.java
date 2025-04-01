package hcmut.examify.Controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hcmut.examify.DTOs.LoginDTO;
import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.Models.User;
import hcmut.examify.Repositories.UserRepository;
import hcmut.examify.Securities.AuthenticationBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import hcmut.examify.Securities.JwtUtilities;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtilities jwtUtilities;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private AuthenticationBean authenticationBean;

    private final Logger logger = LoggerFactory.getLogger(this.getClass()); // debug feature

    // check request from login
    @PostMapping("/authenticate")
    public ResponseEntity<ResponseObject> authenticate( @RequestBody LoginDTO loginDTO
    , HttpServletResponse response) {
        try {
                // Xác thực thông tin người dùng Request lên
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                )
            );

            // Nếu không xảy ra exception tức là thông tin hợp lệ
            // Set thông tin authentication vào Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User user = userRepository.findByUsername(authentication.getName());
            if(user == null){
                throw new UsernameNotFoundException("User not found! ");
            }
            // Trả về token cho người dùng.
            String role = user.getRole().toString();
            String token = jwtUtilities.generateToken(user.getUsername(), role, user.getUserid());

            // Thiết lập cookie với các flags bảo mật
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);     // Ngăn JavaScript truy cập, Đảm bảo js ko truy cập được jwt, -> tăng tính bảo mật, giảm XSS
            cookie.setSecure(true);        // Chỉ truyền qua HTTPS
            cookie.setPath("/");           // Áp dụng cho toàn bộ ứng dụng
            cookie.setMaxAge(3600);        // Thời gian tồn tại 1 giờ
            
            response.addCookie(cookie);

            // Thêm SameSite=None thông qua header
            response.setHeader("Set-Cookie", 
                "jwt=" + token + 
                "; Path=/; " + 
                "HttpOnly; " + 
                "Secure; " + 
                "SameSite=None"
            );

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query create jwt token successfully", token));
        } catch (DataAccessException e) { 
            // Bắt lỗi kết nối, truy vấn, đọc ghi trên DB
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR", "Error create jwt token failed", null));
        } catch (AuthenticationException e) { 
            // Bắt lỗi xác thực user(username và pwd), lỗi xác thực token
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseObject("ERROR", "Invalid username or password", null));
        }
    }

    // check other request
    // note: the requests not call api: /api/checkJwt is still class JwtAuthentication Filter, so you mush add
    // request path to ignore filter of JwtAuthentication Filter 
    @GetMapping("/checkJwt")
    public ResponseEntity<ResponseObject> checkToken () {
        try {
            // B1: call JWT Authentication Filter
            // -> If B1 finished, authenticationBean will receive new jwt
            //B2: check if B1 failed -> return ERROR
            if(!authenticationBean.isPassJwtFilter()) 
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)    
                    .body(new ResponseObject("ERROR", "Error checkJwt failed", null));
            
            // B3: create new token and return to user
            // Nếu không xảy ra exception tức là thông tin hợp lệ
            // SecurityContextHolder đã được set user ở JwtAuthenticationFilter
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            User user = userRepository.findByUsername(authentication.getName());
            if(user == null){
                throw new UsernameNotFoundException("User not found! ");
            }
            // Trả về token cho người dùng.
            String role = user.getRole().toString();
            String token = jwtUtilities.generateToken(user.getUsername(), role, user.getUserid());
            return ResponseEntity.status(HttpStatus.OK)
                    .body(new ResponseObject("OK", "Query to checkJwt successfully", token));

        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseObject("ERROR" + ", " + e.getMessage().toString(), "Error checkJwt failed", null));
        }
    }

    /* TEST METHOD */
    // code mẫu những dòng code cần thiết để check jwt có thành công không
    @GetMapping("/test")
    public String testAuthentication() {
        if(authenticationBean.isPassJwtFilter()) 
            return "Authenticated user: " + authenticationBean.getAuthentication().getName();
        else return "Un-authenticated user";

    }
}
