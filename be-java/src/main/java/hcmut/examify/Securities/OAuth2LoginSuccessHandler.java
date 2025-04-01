package hcmut.examify.Securities;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import hcmut.examify.Models.Role;
import hcmut.examify.Models.User;
import hcmut.examify.Models.DBUser;
import hcmut.examify.Repositories.UserRepository;
import hcmut.examify.Repositories.DBUserRepository;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDate;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtilities jwtUtilities;

    @Autowired
    DBUserRepository dbUserRepository;

    public OAuth2LoginSuccessHandler(JwtUtilities jwtUtilities) {
        this.jwtUtilities = jwtUtilities;
    }

    @Autowired
    @Lazy   // not best solution
    PasswordEncoder passwordEncoder;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            OAuth2User principal = token.getPrincipal();
            
            String name = principal.getAttribute("name");
            String email = principal.getAttribute("email");
            String uniqueId;

            String registrationId = token.getAuthorizedClientRegistrationId();
            if ("github".equals(registrationId)) {
                // For GitHub login, use login name if email is not available
                String login = principal.getAttribute("login");
                uniqueId = email != null ? email : 
                            (login != null ? login : name);
            } else {
                // For other providers (like Google), use email or fall back to name
                uniqueId = email != null ? email : name;
            }

            User user = userRepository.findByUsername(uniqueId);
            Optional<User> optionalUser = Optional.ofNullable(user);

            optionalUser.ifPresentOrElse(u -> {
                String jwtToken = jwtUtilities.generateToken(u.getUsername(), u.getRole().toString(), u.getUserid().toString());
                addJwtCookie(response, jwtToken);
            }, () -> {
                String nameWithoutAccent = removeAccents(name);
                String[] nameParts = splitFullName(nameWithoutAccent);
                String nameUser = nameParts[0] + nameParts[1] + nameParts[2];
                // Đầu tiên, tạo DBUser mới trong bảng users
                DBUser dbUser = dbUserRepository.createAndSaveUser(name, (email != null ? email : (nameUser + "@github.com")), LocalDate.now());
                
                // Sau khi lưu, lấy ID được tạo tự động
                Long dbUserId = dbUser.getId();
                
                // Tạo User trong bảng account và liên kết với DBUser
                User userEntity = new User();
                userEntity.setUsername(nameUser);
                // userEntity.setEmail(nameUser);
                userEntity.setPassword(passwordEncoder.encode(nameUser));
                userEntity.setRole(Role.STUDENT);
                // Thiết lập userid liên kết với id từ bảng users
                userEntity.setUserid(dbUserId.intValue());
                userRepository.save(userEntity);

                String jwtToken = jwtUtilities.generateToken(nameUser, Role.STUDENT.toString(), dbUserId);
                addJwtCookie(response, jwtToken);
            });

            getRedirectStrategy().sendRedirect(request, response, "/home");
        } else {
            super.onAuthenticationSuccess(request, response, authentication);
        }
    }

    private void addJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(3600);
        response.addCookie(cookie);
    }

    private String[] splitFullName(String fullName) {
        // Khởi tạo mảng mặc định với firstName, middleName, lastName
        String[] result = new String[]{"", "", ""};
        
        if (fullName == null || fullName.trim().isEmpty()) {
            // Trả về mảng mặc định nếu fullName null hoặc rỗng
            return result;
        }
    
        // Tách tên thành các phần
        String[] parts = fullName.trim().split("\\s+");
        
        if (parts.length == 1) {
            // Nếu chỉ có 1 phần, đó là firstName
            result[0] = parts[0];
            result[2] = parts[0]; // lastName cũng lấy giá trị này vì là required
        } else if (parts.length == 2) {
            // Nếu có 2 phần
            result[0] = parts[0];    // firstName
            result[2] = parts[1];    // lastName
        } else {
            // Nếu có nhiều hơn 2 phần
            result[0] = parts[0];    // firstName
            
            // Phần giữa là middleName
            StringBuilder middleName = new StringBuilder();
            for (int i = 1; i < parts.length - 1; i++) {
                middleName.append(parts[i]).append(" ");
            }
            result[1] = middleName.toString().trim();
            
            // Phần cuối là lastName
            result[2] = parts[parts.length - 1];
        }
        
        return result;
    }

    // Hàm xóa dấu tiếng Việt
    private String removeAccents(String input) {
        if (input == null) {
            return "";
        }
        
        String temp = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(temp).replaceAll("").replaceAll("Đ", "D").replaceAll("đ", "d");
    }
}