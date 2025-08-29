package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffiliateStatisticsDto {
    private Long totalAffiliates;
    private Long activeAffiliates;
    private Long pendingAffiliates;
    private Long invitedAffiliates;
    private Long rejectedAffiliates;
    private Long inactiveAffiliates;
    private Double totalRevenue;
    private Double totalEarnings;
    private Long totalClicks;
    private Long totalLeads;
    private Long totalCustomers;
}