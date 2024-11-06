package com.travelbnb.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

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

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
