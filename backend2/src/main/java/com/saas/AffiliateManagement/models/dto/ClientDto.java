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
public class ClientDto {
    private Long id;
    private String companyName;
    private String email;
    private String contactFirstName;
    private String contactLastName;
    private String phoneNumber;
    private String website;
    private String address;
    private String city;
    private String country;
    private String postalCode;
    private String industry;
    private String companySize;
    private String status;
    private String subscriptionPlan;
    private String businessDescription;
    private String notes;
    private Boolean emailVerified;
    private String suspensionReason;
    private LocalDateTime emailVerifiedAt;
    private LocalDateTime subscriptionUpgradedAt;
    private LocalDateTime suspendedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}