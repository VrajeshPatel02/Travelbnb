package com.travelbnb.controller;

import com.travelbnb.payload.JWTTokenDto;
import com.travelbnb.payload.LoginDto;
import com.travelbnb.payload.UserDto;
import com.travelbnb.service.JWTService;
import com.travelbnb.service.UserImpl;
import com.travelbnb.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    @Autowired
    private UserService user;
    @Autowired
    private UserImpl userImpl;

    @PostMapping("/createUser")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto dto, BindingResult result){
        if(result.hasErrors()){
            return new ResponseEntity<>(Objects.requireNonNull(result.getFieldError()).getDefaultMessage(), HttpStatus.OK);
        }
        if(user.existByEmail(dto)){
            return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
        }
        if(user.existByUsername(dto)){
            return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
        }
        UserDto created = user.addUser(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> verifyLogin(@RequestBody LoginDto loginDto){
        String token = user.verifyUser(loginDto);
        if(token!=null){
            JWTTokenDto jwtToken = new JWTTokenDto();
            jwtToken.setType("JWT Token");
            jwtToken.setToken(token);
            return new ResponseEntity<>(jwtToken, HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Invalid token", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @DeleteMapping("/deleteUser")
    public ResponseEntity<?> deleteUser(String email){
        boolean val = user.deleteUserByEmail(email);
        if(val){
            return new ResponseEntity<>("success",HttpStatus.OK);
        }
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/travelUser")
    public ResponseEntity<?>getUser(@RequestParam Long userId){
        UserDto userDetails = user.getUserDetails(userId);
        if(userDetails == null){
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userDetails , HttpStatus.OK);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto){
        UserDto updatedUser = user.updateUser(userDto);
        if(updatedUser != null) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>("Invalid User", HttpStatus.NOT_FOUND);
    }
}
