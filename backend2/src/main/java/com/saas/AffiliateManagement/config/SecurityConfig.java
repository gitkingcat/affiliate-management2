package com.saas.AffiliateManagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Temporary Security Configuration for development.
 * TODO: Implement proper JWT authentication for production.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_URLS = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/api-docs/**",
            "/v3/api-docs/**",
            "/api/v1/clients/register",
            "/api/v1/clients/*/verify-email",
            "/h2-console/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for development (enable in production with proper configuration)
                .csrf(csrf -> csrf.disable())

                // Disable frame options for H2 console
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Configure authorization
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(PUBLIC_URLS).permitAll()
                        .requestMatchers("/api/**").permitAll() // Temporarily allow all API access for testing
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}