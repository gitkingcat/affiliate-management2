package com.saas.AffiliateManagement.models.dto;

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
public class TopAffiliateDto {

    private Long id;
    private String name;
    private String email;
    private String status;
    private BigDecimal totalRevenue;
    private BigDecimal totalCommissions;
    private Long totalReferrals;
    private Long totalConversions;
    private BigDecimal conversionRate;
    private LocalDateTime joinDate;
}