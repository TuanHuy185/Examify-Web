package hcmut.examify.Securities;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component    // conflict between Bean(private final) and Autowired
//@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // bộ lọc sử dụng cho các request từ phía FE khi đã có jwt token rồi
    private final JwtUtilities jwtUtilities;

    private final CustomUserDetailsService customUserDetailsService;

    private final AuthenticationBean authenticationBean;

    private final WhiteList whiteList;
    
    public JwtAuthenticationFilter(@NonNull JwtUtilities jwtUtilities, 
                                    @NonNull CustomUserDetailsService customUserDetailsService,
                                    @NonNull AuthenticationBean authenticationBean,
                                    @NonNull WhiteList whiteList ) {
        this.jwtUtilities = jwtUtilities;
        this.customUserDetailsService = customUserDetailsService;
        this.authenticationBean = authenticationBean;
        this.whiteList = whiteList;                                
    }
    // @Autowired
    // private WhiteList whiteList;

    // private String[] WHITE_LIST_URL = {
    //     "/",
    //     "/index",
    //     "/about",
    //     "/login",
    //     "/403",
    //     "/api/authenticate"
    // };

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        //log.info("requested url: {}", request.getServletPath());
        // url cơ bản được bỏ qua
        if(request.getServletPath().equals("/")) {
            filterChain.doFilter(request, response);
            return;
        }
        // duyệt qua các page url có thể bỏ qua lớp jwt filter
        for (String url : whiteList.getWHITE_LIST_URL()) {
            if (request.getServletPath().contains(url)) {
                filterChain.doFilter(request, response);
                return;
            }
        }
        // duyệt qua các resource url có thể bỏ qua lớp jwt filter
        for (String url : whiteList.getRESOURCE_LIST_URL()) {
            if (request.getServletPath().contains(url)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        try {
            String token = jwtUtilities.getToken(request);
            
            if(token != null && jwtUtilities.validateToken(token)){
                String uname = jwtUtilities.extractUsername(token);
                String userId = jwtUtilities.extractUserId(token);
                
                // Lưu userId vào request attribute để các controller có thể sử dụng
                request.setAttribute("userId", userId);
                
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(uname);
                if(userDetails != null){
                    UsernamePasswordAuthenticationToken authenticationToken = 
                        new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
                    
                    log.info("authenticated user with username :{}", uname);
                    // set user vào SecurityContextHolder
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    // Set authentication vào AuthenticationBean
                    authenticationBean.setAuthentication(authenticationToken);
                }
            }
         } catch (Exception ex) {
             log.error("failed on set user authentication with error occur is: ", ex);
         }

        filterChain.doFilter(request, response);
    }
}
