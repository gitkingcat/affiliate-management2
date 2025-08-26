package com.saas.AffiliateManagement.models.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeriodStatisticsDto {

    private Long clientId;
    private Long newAffiliatesCount;
    private Map<String, Long> affiliatesByStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
