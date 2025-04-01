package hcmut.examify.Controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class PageController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass()); // debug feature

    @RequestMapping(value = {"/", "/index"}, method = RequestMethod.GET)
    String webcomePage(){
        return "index";
    }

    @RequestMapping("/login")
    String loginPage(){
        return "login";
    }

    @RequestMapping("/signout")
    public String signoutPage(HttpServletResponse response){
        Cookie cookie = new Cookie("jwt", "");
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "redirect:/index";
    }

    @RequestMapping("/403")
    String ErrorPage(){
        return "403Page";
    }

    @Controller
    public class AcceptedPage {

        @GetMapping("/home")
        String homePage(){
            return "homePage";
        }

        @GetMapping("/payment")
        String paymentPage(){
            return "payment";
        }

        @GetMapping("/sendEmail")
        String sendEmailPage(){
            return "emailForm";
        }
    }
}

