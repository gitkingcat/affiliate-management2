package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralDto {
    private Long id;
    private Long affiliateId;
    private String affiliateName;
    private String referralCode;
    private String targetUrl;
    private String sourceUrl;
    private String status;
    private String userAgent;
    private String ipAddress;
    private String deviceType;
    private String browserName;
    private String operatingSystem;
    private String country;
    private String city;
    private BigDecimal conversionValue;
    private String orderId;
    private Map<String, Object> metadata;
    private LocalDateTime clickedAt;
    private LocalDateTime convertedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}