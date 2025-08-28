package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.DashboardStatisticsDto;
import com.saas.AffiliateManagement.models.dto.PeriodStatisticsDto;
import com.saas.AffiliateManagement.models.dto.TopAffiliateDto;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StatisticsService {

    DashboardStatisticsDto getClientDashboardStatistics(Long clientId, Integer days);

    Long getNewAffiliatesCount(Long clientId, Integer days);

    PeriodStatisticsDto getAffiliatePeriodStatistics(Long clientId,
                                                     LocalDateTime startDate,
                                                     LocalDateTime endDate);

    Long getTotalAffiliatesCount(Long clientId);

    Long getActiveAffiliatesCount(Long clientId);

    Long getPendingAffiliatesCount(Long clientId);

    List<TopAffiliateDto> getTopAffiliatesForClient(@Min(1) Long clientId, @Min(1) Integer limit, Optional<LocalDateTime> startDate, Optional<LocalDateTime> endDate);
}
