package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffiliateDto {
    private Long id;
    private Long clientId;
    private String clientCompanyName;
    private String email;
    private String firstName;
    private String lastName;
    private String companyName;
    private String phoneNumber;
    private String status;
    private String paymentMethod;
    private String paymentDetails;
    private String website;
    private String socialMediaLinks;
    private String notes;
    private String referralCode;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}