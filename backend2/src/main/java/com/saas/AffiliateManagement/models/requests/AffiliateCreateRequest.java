package com.saas.AffiliateManagement.models.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffiliateCreateRequest {

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @Size(max = 100, message = "Company name cannot exceed 100 characters")
    private String companyName;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;

    private String paymentMethod;
    private String paymentDetails;

    @Size(max = 255, message = "Website URL cannot exceed 255 characters")
    private String website;

    @Size(max = 500, message = "Social media links cannot exceed 500 characters")
    private String socialMediaLinks;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}