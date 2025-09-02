package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.AuthResponse;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.models.entity.User;
import com.saas.AffiliateManagement.models.requests.LoginRequest;
import com.saas.AffiliateManagement.models.requests.RegisterRequest;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.repository.UserRepository;
import com.saas.AffiliateManagement.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Check if company name already exists
        if (clientRepository.existsByCompanyName(request.getCompanyName())) {
            throw new RuntimeException("Company with this name already exists");
        }

        // Create new client (company)
        Client client = Client.builder()
                .companyName(request.getCompanyName())
                .name(request.getCompanyName())
                .email(request.getEmail())
                .contactFirstName(request.getFirstName())
                .contactLastName(request.getLastName())
                .status("ACTIVE")
                .subscriptionPlan("FREE")
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .build();

        client = clientRepository.save(client);
        log.info("Created new client: {}", client.getCompanyName());

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .client(client)
                .role("CLIENT_OWNER")
                .active(true)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        log.info("Created new user: {}", user.getEmail());

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .clientId(client.getId())
                .companyName(client.getCompanyName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!user.getActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

        log.info("User {} successfully logged in", user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .clientId(user.getClient() != null ? user.getClient().getId() : null)
                .companyName(user.getClient() != null ? user.getClient().getCompanyName() : null)
                .build();
    }
}