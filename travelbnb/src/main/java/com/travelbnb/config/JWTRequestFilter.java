package com.travelbnb.config;

import com.travelbnb.entity.User;
import com.travelbnb.repository.UserEntityRepository;
import com.travelbnb.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JWTRequestFilter extends OncePerRequestFilter {
    private JWTService jwtService;
    private UserEntityRepository userRepository;
    public JWTRequestFilter(JWTService jwtService,
                            UserEntityRepository userRepository)
    {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String accessTokenHeader = request.getHeader("Authorization");
        String refreshTokenHeader = request.getHeader("Refresh-Token");

        if (accessTokenHeader != null && accessTokenHeader.startsWith("Bearer ")) {
            String accessToken = accessTokenHeader.substring(7);
            processAccessToken(accessToken, refreshTokenHeader, request, response);
        }

        filterChain.doFilter(request, response);
    }
    private void processAccessToken(String accessToken, String refreshToken, HttpServletRequest request, HttpServletResponse response) {
        if (jwtService.isTokenValid(accessToken)) {
            authenticateUser(accessToken, request);
        } else if (refreshToken != null && jwtService.isTokenValid(refreshToken)) {
            String username = jwtService.gerUserName(refreshToken);
            Optional<User> userOptional = userRepository.findByUsername(username);

            userOptional.ifPresent(user -> {
                String newAccessToken = jwtService.generateToken(user);
                response.setHeader("Access-Token", newAccessToken);
                authenticateUser(newAccessToken, request);
            });
        }
    }

    private void authenticateUser(String token, HttpServletRequest request) {
        String username = jwtService.gerUserName(token);
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user, null, Collections.singleton(new SimpleGrantedAuthority(user.getRole())));

            authentication.setDetails(new WebAuthenticationDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
}