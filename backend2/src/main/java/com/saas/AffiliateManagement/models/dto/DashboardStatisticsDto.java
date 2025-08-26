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
public class DashboardStatisticsDto {

    private Long newAffiliatesCount;
    private Long totalAffiliatesCount;
    private Long activeAffiliatesCount;
    private Long pendingAffiliatesCount;
    private Long totalClicks;
    private Long totalConversions;
    private BigDecimal totalRevenue;
    private BigDecimal totalCommissions;
    private Integer periodDays;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
