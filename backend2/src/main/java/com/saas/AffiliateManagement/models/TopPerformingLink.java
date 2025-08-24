package com.saas.AffiliateManagement.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopPerformingLink {
    private String referralCode;
    private String targetUrl;
    private Long clicks;
    private Long conversions;
    private BigDecimal conversionRate;
    private BigDecimal revenue;
}