package com.saas.AffiliateManagement.models.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ReferralTrackingInfo {

    private String referralCode;
    private String affiliateId;
    private String affiliateName;
    private String clientName;
    private String status;
    private String targetUrl;
    private String campaign;
    private LocalDateTime clickedAt;
    private LocalDateTime convertedAt;
    private BigDecimal conversionValue;
    private String customerEmail;
    private TrackingData trackingData;
}