package com.saas.AffiliateManagement.models.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, unique = true, length = 100)
    private String companyName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "contact_first_name", nullable = false, length = 50)
    private String contactFirstName;

    @Column(name = "contact_last_name", nullable = false, length = 50)
    private String contactLastName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String website;

    @Column(length = 200)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(length = 50)
    private String industry;

    @Column(name = "company_size", length = 20)
    private String companySize;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "subscription_plan", nullable = false, length = 20)
    private String subscriptionPlan;

    @Column(name = "business_description", length = 500)
    private String businessDescription;

    @Column(length = 1000)
    private String notes;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified;

    @Column(name = "email_verification_token")
    private String emailVerificationToken;

    @Column(name = "suspension_reason", length = 500)
    private String suspensionReason;

    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    @Column(name = "subscription_upgraded_at")
    private LocalDateTime subscriptionUpgradedAt;

    @Column(name = "suspended_at")
    private LocalDateTime suspendedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public String getContactName() {
        return contactFirstName + " " + contactLastName;
    }
}