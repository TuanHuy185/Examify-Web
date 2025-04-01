package hcmut.examify.Securities;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/* 
 * The section after login still normal access to page if unexpired
 */
@Component
@Slf4j
public class JwtUtilities {
    
    private final String secret = "4Bs13l";

    private final Long jwtExpiration = 604800000L;;

    public Claims extractAllClaims(String token) {
        return  Jwts.parser().
                setSigningKey(secret).
                parseClaimsJws(token).getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractUserId(String token) {
        Object userId = extractClaim(token, claims -> claims.get("userId"));
        return userId != null ? userId.toString() : null;
    }

    public Date extractExpiration(String token) { return extractClaim(token, Claims::getExpiration); }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String uname = extractUsername(token);
        return (uname.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String generateToken(String username, String role) { //roles type is List<String> ?
        return  Jwts.builder()
                .setSubject(username)
                .claim("role",role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(Instant.now().plus(jwtExpiration, ChronoUnit.MILLIS)))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public String generateToken(String username, String role, Object userId) {
        return  Jwts.builder()
                .setSubject(username)
                .claim("role",role)
                .claim("userId", userId != null ? userId.toString() : "")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(Instant.now().plus(jwtExpiration, ChronoUnit.MILLIS)))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.info("Invalid JWT signature.");
            log.trace("Invalid JWT signature trace: {}", e);
        } catch (MalformedJwtException e) {
            log.info("Invalid JWT token.");
            log.trace("Invalid JWT token trace: {}", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token.");
            log.trace("Expired JWT token trace: {}", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token.");
            log.trace("Unsupported JWT token trace: {}", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT token compact of handler are invalid.");
            log.trace("JWT token compact of handler are invalid trace: {}", e);
        }
        return false;
    }

    private final Logger logger = LoggerFactory.getLogger(this.getClass()); // debug feature
    
    // IF COOKIES IS ONLY CONTAINS JWT TOKEN
    // public String getToken (HttpServletRequest httpServletRequest) {
    //     final String bearerToken = httpServletRequest.getHeader("Authorization");

    //     logger.info("bearerToken is: {}", bearerToken);

    //     if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
    //         return bearerToken.substring(7,bearerToken.length()); 
    //     } // The part after "Bearer "
    //      return null;
    // }

    // IF COOKIES CONTAIN MORE THAN 1 TOKEN
    // FEATURE: Auto get all token in Cookies backend if Cookies is non-empty
    public String getToken(HttpServletRequest httpServletRequest) {
        Cookie[] cookies = httpServletRequest.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {  
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
