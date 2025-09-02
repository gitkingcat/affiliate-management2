package com.saas.AffiliateManagement.models.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "affiliates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Affiliate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "unique_identifier", nullable = false, unique = true, length = 50)
    private String uniqueIdentifier;

    @Column(name = "target_url", nullable = false, length = 2000)
    private String targetUrl;

    @Column(nullable = false)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(nullable = false)
    private String status;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_details")
    private String paymentDetails;

    private String website;

    @Column(name = "social_media_links")
    private String socialMediaLinks;

    @Column(length = 1000)
    private String notes;

    @Column(name = "referral_code", unique = true)
    private String referralCode;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public String getName() {
        return firstName + " " + lastName;
    }
}