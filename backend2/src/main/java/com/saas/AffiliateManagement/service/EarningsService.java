package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.EarningsDataDto;
import com.saas.AffiliateManagement.models.dto.EarningsTrendDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EarningsService {

    Page<EarningsDataDto> getEarningsTrends(
            Optional<Long> affiliateId,
            Optional<Long> clientId,
            String period,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate,
            Pageable pageable
    );

    EarningsTrendDto getAffiliateEarnings(
            Long affiliateId,
            String period,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate
    );

    EarningsTrendDto getEarningsSummary(
            Optional<Long> clientId,
            String period,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate
    );
}