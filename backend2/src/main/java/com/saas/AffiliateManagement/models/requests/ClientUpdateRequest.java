package com.saas.AffiliateManagement.models.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientUpdateRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String companyName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Contact first name is required")
    @Size(min = 2, max = 50, message = "Contact first name must be between 2 and 50 characters")
    private String contactFirstName;

    @NotBlank(message = "Contact last name is required")
    @Size(min = 2, max = 50, message = "Contact last name must be between 2 and 50 characters")
    private String contactLastName;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;

    @Size(max = 255, message = "Website URL cannot exceed 255 characters")
    private String website;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    @Size(max = 100, message = "City cannot exceed 100 characters")
    private String city;

    @Size(max = 100, message = "Country cannot exceed 100 characters")
    private String country;

    @Size(max = 20, message = "Postal code cannot exceed 20 characters")
    private String postalCode;

    @Size(max = 50, message = "Industry cannot exceed 50 characters")
    private String industry;

    @Size(max = 20, message = "Company size cannot exceed 20 characters")
    private String companySize;

    @Size(max = 500, message = "Business description cannot exceed 500 characters")
    private String businessDescription;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
}