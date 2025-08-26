package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.DashboardStatisticsDto;
import com.saas.AffiliateManagement.models.dto.PeriodStatisticsDto;

import java.time.LocalDateTime;

public interface StatisticsService {

    DashboardStatisticsDto getClientDashboardStatistics(Long clientId, Integer days);

    Long getNewAffiliatesCount(Long clientId, Integer days);

    PeriodStatisticsDto getAffiliatePeriodStatistics(Long clientId,
                                                     LocalDateTime startDate,
                                                     LocalDateTime endDate);

    Long getTotalAffiliatesCount(Long clientId);

    Long getActiveAffiliatesCount(Long clientId);

    Long getPendingAffiliatesCount(Long clientId);
}
