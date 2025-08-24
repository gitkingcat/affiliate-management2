package com.saas.AffiliateManagement.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralCreateRequest {

    @NotNull(message = "Affiliate ID is required")
    private Long affiliateId;

    @NotBlank(message = "Referral code is required")
    @Size(max = 100, message = "Referral code cannot exceed 100 characters")
    private String referralCode;

    @NotBlank(message = "Target URL is required")
    @Size(max = 2000, message = "Target URL cannot exceed 2000 characters")
    private String targetUrl;

    @Size(max = 2000, message = "Source URL cannot exceed 2000 characters")
    private String sourceUrl;

    private Map<String, Object> metadata;
}