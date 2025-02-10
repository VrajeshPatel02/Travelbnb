package com.travelbnb.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private long id;
    @NotNull
    @Size(min = 2, message = "Name should be at least 2 characters")
    private String name;
    @NotNull
    @Size(min = 2, message = "Username should be at least 2 characters")
    private String username;
    @Email
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @NotNull
    private String role;

    private LocalDateTime createdAt;

    public UserDto( long id, String name, String username ,String email,String role, LocalDateTime createdAt )   {
        this.role = role;
        this.email = email;
        this.username = username;
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    public UserDto() {
    }
}
