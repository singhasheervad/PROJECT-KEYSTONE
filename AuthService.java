package com.keystone.backend.service;

import com.keystone.backend.domain.User;
import com.keystone.backend.dto.LoginRequest;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtService = jwtService;
    }

    public User register(
            String name,
            String email,
            String password,
            String role
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);

        // Store only the BCrypt hash, never the plain password.
        user.setPassword(passwordEncoder.encode(password));

        // KEYSTONE has four official roles.
        if (role == null || role.isBlank()) {
            role = "CUSTOMER";
        }

        role = role.toUpperCase();

        if (!role.equals("DISPATCHER")
                && !role.equals("TECHNICIAN")
                && !role.equals("MANAGER")
                && !role.equals("CUSTOMER")) {

            throw new RuntimeException("Invalid role");
        }

        user.setRole(role);

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );
    }
}