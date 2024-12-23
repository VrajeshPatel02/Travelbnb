package com.travelbnb.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserDto {
    private long id;
    @NotNull
    @Size(min=2, message="Name should be at least 2 characters")
    private String name;
    @NotNull
    @Size(min=2, message="Username should be at least 2 characters")
    private String username;
    @Email
    private String email;
    @JsonProperty(access= JsonProperty.Access.WRITE_ONLY)
    private String password;
    @NotNull
    private String role;

    public UserDto() {
    }
    public UserDto(Long id,String  name, String username, String email, String role) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.role = role;
    }

}
