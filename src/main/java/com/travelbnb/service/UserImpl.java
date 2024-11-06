package com.travelbnb.service;

import com.travelbnb.entity.User;
import com.travelbnb.payload.LoginDto;
import com.travelbnb.payload.UserDto;
import com.travelbnb.repository.UserEntityRepository;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserImpl implements UserService{
    private UserEntityRepository userRepository;
    private JWTService jwtService;

    public UserImpl(UserEntityRepository userRepository, JWTService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public UserDto addUser(UserDto userDto) {
        User entity = DtoToEntity(userDto);
        UserDto dto = EntityToDto(entity);
        User saved = userRepository.save(entity);
        return dto;
    }

    public UserDto EntityToDto(User entity) {
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setUsername(entity.getUsername());
        dto.setEmail(entity.getEmail());
        dto.setPassword(entity.getPassword());
        dto.setRole(entity.getRole());
        return dto;
    }

    public User DtoToEntity(UserDto userDto) {
        User entity = new User();
        entity.setId(userDto.getId());
        entity.setName(userDto.getName());
        entity.setUsername(userDto.getUsername());
        entity.setEmail(userDto.getEmail());
        entity.setPassword(BCrypt.hashpw(userDto.getPassword(), BCrypt.gensalt(10)));
        entity.setRole(userDto.getRole());
        return entity;
    }

    @Override
    public boolean existByEmail(UserDto dto) {
        boolean val = userRepository.existsByEmail(dto.getEmail());
        return val;
    }

    @Override
    public boolean existByUsername(UserDto dto) {
        boolean val = userRepository.existsByUsername(dto.getUsername());
        return val;
    }

    @Override
    public String verifyUser(LoginDto loginDto){
        Optional<User> opUser = userRepository.findByUsername(loginDto.getUsername());
        User appUser = opUser.get();
        if(opUser.isPresent()){
            if(BCrypt.checkpw(loginDto.getPassword(), appUser.getPassword())){
                String token = jwtService.generateToken(appUser);
                return token;
            }
        }
        return null;
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        Optional<User> opUser = userRepository.findById(userDto.getId());
        if(opUser.isPresent()){
            User entity = DtoToEntity(userDto);
            UserDto dto = EntityToDto(entity);
            User saved = userRepository.save(entity);
            return dto;
        }
        return null;
    }

    @Override
    public boolean deleteUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()){
            userRepository.deleteById(user.get().getId());
            return true;
        }
        return false;
    }
    @Override
    public UserDto getUserDetails(Long userId) {
        Optional<User> byId = userRepository.findById(userId);
        if(byId.isPresent()) {
            UserDto Dto = EntityToDto(byId.get());
            return Dto;
        }
        return null;
    }
}
