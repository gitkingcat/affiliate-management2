package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.models.dto.DashboardStatisticsDto;
import com.saas.AffiliateManagement.models.dto.PeriodStatisticsDto;
import com.saas.AffiliateManagement.models.dto.TopAffiliateDto;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.CommissionRepository;
import com.saas.AffiliateManagement.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final AffiliateRepository affiliateRepository;
    private final ReferralRepository referralRepository;
    private final CommissionRepository commissionRepository;

    @Override
    public DashboardStatisticsDto getClientDashboardStatistics(Long clientId,
                                                               Integer days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();

        Long newAffiliatesCount = affiliateRepository
                .countByClientIdAndCreatedAtBetween(clientId, startDate, endDate);

        Long totalAffiliatesCount = affiliateRepository.countByClientId(clientId);

        Long activeAffiliatesCount = affiliateRepository
                .countByClientIdAndStatus(clientId, "ACTIVE");

        Long pendingAffiliatesCount = affiliateRepository
                .countByClientIdAndStatus(clientId, "PENDING");

        Long totalClicks = referralRepository
                .countByAffiliateClientIdAndCreatedAtBetween(clientId,
                        startDate, endDate);

        Long totalConversions = referralRepository
                .countByAffiliateClientIdAndStatusAndCreatedAtBetween(clientId,
                        "CONVERTED", startDate, endDate);

        BigDecimal totalRevenue = referralRepository
                .calculateTotalRevenueByClientIdAndDateRange(clientId,
                        startDate, endDate);

        BigDecimal totalCommissions = commissionRepository
                .calculateTotalCommissionByClientIdAndDateRange(clientId,
                        startDate, endDate);

        return DashboardStatisticsDto.builder()
                .newAffiliatesCount(newAffiliatesCount)
                .totalAffiliatesCount(totalAffiliatesCount)
                .activeAffiliatesCount(activeAffiliatesCount)
                .pendingAffiliatesCount(pendingAffiliatesCount)
                .totalClicks(totalClicks)
                .totalConversions(totalConversions)
                .totalRevenue(totalRevenue)
                .totalCommissions(totalCommissions)
                .periodDays(days)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    @Override
    public Long getNewAffiliatesCount(Long clientId, Integer days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();

        return affiliateRepository
                .countByClientIdAndCreatedAtBetween(clientId, startDate, endDate);
    }

    @Override
    public PeriodStatisticsDto getAffiliatePeriodStatistics(Long clientId,
                                                            LocalDateTime startDate,
                                                            LocalDateTime endDate) {
        Long newAffiliatesCount = affiliateRepository
                .countByClientIdAndCreatedAtBetween(clientId, startDate, endDate);

        Map<String, Long> affiliatesByStatus = new HashMap<>();
        affiliatesByStatus.put("ACTIVE", affiliateRepository
                .countByClientIdAndStatus(clientId, "ACTIVE"));
        affiliatesByStatus.put("PENDING", affiliateRepository
                .countByClientIdAndStatus(clientId, "PENDING"));
        affiliatesByStatus.put("INACTIVE", affiliateRepository
                .countByClientIdAndStatus(clientId, "INACTIVE"));
        affiliatesByStatus.put("REJECTED", affiliateRepository
                .countByClientIdAndStatus(clientId, "REJECTED"));

        return PeriodStatisticsDto.builder()
                .clientId(clientId)
                .newAffiliatesCount(newAffiliatesCount)
                .affiliatesByStatus(affiliatesByStatus)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    @Override
    public Long getTotalAffiliatesCount(Long clientId) {
        return affiliateRepository.countByClientId(clientId);
    }

    @Override
    public Long getActiveAffiliatesCount(Long clientId) {
        return affiliateRepository
                .countByClientIdAndStatus(clientId, "ACTIVE");
    }

    @Override
    public Long getPendingAffiliatesCount(Long clientId) {
        return affiliateRepository
                .countByClientIdAndStatus(clientId, "PENDING");
    }

    @Override
    public List<TopAffiliateDto> getTopAffiliatesForClient(Long clientId,
                                                           Integer limit,
                                                           Optional<LocalDateTime> startDate,
                                                           Optional<LocalDateTime> endDate) {

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(6));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        Pageable pageable = PageRequest.of(0, limit);

        List<Affiliate> affiliates = affiliateRepository.findByClientId(clientId);

        return affiliates.stream()
                .map(affiliate -> buildTopAffiliateDto(affiliate, start, end))
                .sorted((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private TopAffiliateDto buildTopAffiliateDto(Affiliate affiliate,
                                                 LocalDateTime startDate,
                                                 LocalDateTime endDate) {

        BigDecimal totalCommissions = commissionRepository
                .calculateTotalCommissionByAffiliateId(affiliate.getId(), startDate, endDate)
                .orElse(BigDecimal.ZERO);

        BigDecimal totalRevenue = referralRepository
                .calculateTotalRevenue(affiliate.getId(), startDate, endDate)
                .orElse(BigDecimal.ZERO);

        Long totalReferrals = referralRepository
                .countByAffiliateIdAndCreatedAtBetween(affiliate.getId(), startDate, endDate);

        Long totalConversions = referralRepository
                .countByAffiliateIdAndStatusAndCreatedAtBetween(
                        affiliate.getId(), "CONVERTED", startDate, endDate);

        BigDecimal conversionRate = totalReferrals > 0
                ? BigDecimal.valueOf(totalConversions)
                .divide(BigDecimal.valueOf(totalReferrals), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return TopAffiliateDto.builder()
                .id(affiliate.getId())
                .name(affiliate.getName())
                .email(affiliate.getEmail())
                .status(affiliate.getStatus())
                .totalRevenue(totalRevenue)
                .totalCommissions(totalCommissions)
                .totalReferrals(totalReferrals)
                .totalConversions(totalConversions)
                .conversionRate(conversionRate)
                .joinDate(affiliate.getCreatedAt())
                .build();
    }

}
