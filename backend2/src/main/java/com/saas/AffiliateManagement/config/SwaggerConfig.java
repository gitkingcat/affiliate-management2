package com.saas.AffiliateManagement.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration for OpenAPI/Swagger documentation.
 * Provides API documentation and testing interface through Swagger UI.
 *
 * @author Vladislavs Kraslavskis
 * @version 1.0
 */
@Configuration
public class SwaggerConfig {

    @Value("${spring.application.name:Affiliate Management}")
    private String applicationName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(getInfo())
                .servers(getServers())
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", createBearerAuthScheme()));
    }

    private Info getInfo() {
        return new Info()
                .title(applicationName + " API")
                .description("""
                        ## Affiliate Management System API
                        
                        Comprehensive REST API for managing affiliate marketing programs.
                        
                        ### Main Features:
                        - **Multi-tenant SaaS** - Client management with subscription tiers
                        - **Affiliate Management** - Registration, approval, and tracking
                        - **Referral Tracking** - Click tracking, conversions, and analytics
                        - **Commission System** - Automated calculation and payment processing
                        - **Analytics** - Real-time performance metrics and reporting
                        
                        ### Authentication:
                        Most endpoints require JWT Bearer token authentication.
                        Public endpoints are marked accordingly.
                        
                        ### Rate Limiting:
                        API requests are rate-limited per client. Check response headers for limits.
                        """)
                .version("1.0.0")
                .contact(new Contact()
                        .name("Support Team")
                        .email("support@affiliate-system.com")
                        .url("https://affiliate-system.com"))
                .license(new License()
                        .name("Proprietary")
                        .url("https://affiliate-system.com/license"));
    }

    private List<Server> getServers() {
        return List.of(
                new Server()
                        .url("http://localhost:8080")
                        .description("Local Development Server"),
                new Server()
                        .url("https://api.affiliate-system.com")
                        .description("Production Server")
        );
    }

    private SecurityScheme createBearerAuthScheme() {
        return new SecurityScheme()
                .name("bearerAuth")
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT Bearer token authentication. " +
                        "Enter your token in the format: Bearer {token}");
    }
}