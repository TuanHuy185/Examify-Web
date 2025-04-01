package hcmut.examify.Controllers.RestfulAPIs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import hcmut.examify.DTOs.ChangePasswordDTO;
import hcmut.examify.DTOs.NewAccountDTO;
import hcmut.examify.DTOs.ResponseObject;
import hcmut.examify.DTOs.UpdateAccountDTO;
import hcmut.examify.Services.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ResponseObject> addUser(@RequestBody NewAccountDTO newAccount) {
        return userService.PROC_addUser(newAccount);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ResponseObject> updateUserInfor(@RequestBody UpdateAccountDTO updateAccount, @PathVariable Integer userId) {
        return userService.PROC_updateUserInfor(updateAccount, userId);
    }

    @PutMapping("/change-password")
    public ResponseEntity<ResponseObject> changePassword(@RequestBody ChangePasswordDTO changePassword) {
        return userService.PROC_changePassword(changePassword);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseObject> getUserInfo(@PathVariable Integer userId) {
        return userService.FNC_getUserInfo(userId);
    }
}
