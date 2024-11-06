package com.travelbnb.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.travelbnb.entity.User;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JWTService {
    @Value("${jwt.algorithm.key}")
    private String algorithmKey;
    @Value("${jwt.issuer}")
    private String issuer;
    @Value("${jwt.expiry.duration}")
    private int expiryTime;

    private Algorithm algorithm;
    private final String USER_NAME = "username";

    @PostConstruct
    private void initializeAlgorithm() {
        algorithm = Algorithm.HMAC256(algorithmKey);
    }

    public String generateToken(User user) {
        String sign = JWT.create()
                .withClaim(USER_NAME, user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiryTime))
                .withIssuer(issuer)
                .sign(algorithm);
        System.out.println(sign);
        return sign;
    }

    public String gerUserName(String token){
        try {
            DecodedJWT decodedJWT = JWT.require(algorithm).withIssuer(issuer).build().verify(token);
            return decodedJWT.getClaim(USER_NAME).asString();
        } catch (JWTVerificationException e) {
            throw new RuntimeException(e);
        }
    }
}
