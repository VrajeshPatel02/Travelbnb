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

        String tokenHeader = request.getHeader("Authorization");
        if(tokenHeader!=null && tokenHeader.startsWith("Bearer ")){
            String token = tokenHeader.substring(7, tokenHeader.length());
            System.out.println(token);
            String username = jwtService.gerUserName(token);
            Optional<User> opUsername = userRepository.findByUsername(username);
            if(opUsername.isPresent()){
                User userEntity = opUsername.get();
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken
                        (userEntity, null, Collections.singleton(new SimpleGrantedAuthority(userEntity.getRole())));
                authentication.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
