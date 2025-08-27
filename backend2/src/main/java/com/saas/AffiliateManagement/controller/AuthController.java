package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.dto.AuthResponse;
import com.saas.AffiliateManagement.models.requests.LoginRequest;
import com.saas.AffiliateManagement.models.requests.RegisterRequest;
import com.saas.AffiliateManagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
@Tag(name = "Authentication", description = "Authentication management endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates new user account with company")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());

        AuthResponse response = authService.register(request);

        log.info("User successfully registered with ID: {}", response.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates user and returns JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        AuthResponse response = authService.login(request);

        log.info("Successful login for user ID: {}", response.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Check if auth service is running")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth service is running");
    }
}