package com.keystone.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secure")
public class SecureTestController {

    @GetMapping("/hello")
    public String secureHello(Authentication authentication) {
        return "Authenticated as: "
                + authentication.getName()
                + " | Role: "
                + authentication.getAuthorities();
    }
}
