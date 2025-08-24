package com.saas.AffiliateManagement.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversionTrend {
    private LocalDateTime date;
    private BigDecimal conversionRate;
    private Long clicks;
    private Long conversions;
    private BigDecimal revenue;
    private String trendDirection;
    private BigDecimal changePercentage;
}