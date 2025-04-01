package hcmut.examify.Securities;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

//Role: Check if JwtAuthenticationFilter not create jwt token
@Component
public class AuthenticationBean {
    private UsernamePasswordAuthenticationToken authentication;

    public UsernamePasswordAuthenticationToken getAuthentication() {
        return authentication;
    }

    public void setAuthentication(UsernamePasswordAuthenticationToken authentication) {
        this.authentication = authentication;
    }

    public boolean isPassJwtFilter(){
        if(authentication == null) return false;
        authentication = null;
        return true;
    }
}
