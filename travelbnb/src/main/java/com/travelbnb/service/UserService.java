package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.LoginDto;
import com.travelbnb.payload.UserDto;

public interface UserService {
    UserDto addUser(UserDto userDto);
    boolean existByEmail(UserDto dto);
    boolean existByUsername(UserDto dto);
    String verifyUser(LoginDto loginDto);
    UserDto updateUser(UserDto userDto);
    boolean deleteUserByEmail(String email);
    UserDto getUserDetails(Long userId);
}
