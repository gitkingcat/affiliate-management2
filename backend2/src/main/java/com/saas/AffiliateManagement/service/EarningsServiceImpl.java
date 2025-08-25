package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.AffiliateNotFoundException;
import com.saas.AffiliateManagement.models.dto.EarningsDataDto;
import com.saas.AffiliateManagement.models.dto.EarningsTrendDto;

import com.saas.AffiliateManagement.models.entity.Commission;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.CommissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@Slf4j
@Transactional(readOnly = true)
public class EarningsServiceImpl implements EarningsService {

    private final CommissionRepository commissionRepository;
    private final AffiliateRepository affiliateRepository;

    @Autowired
    public EarningsServiceImpl(
            CommissionRepository commissionRepository,
            AffiliateRepository affiliateRepository) {
        this.commissionRepository = commissionRepository;
        this.affiliateRepository = affiliateRepository;
    }

    @Override
    public Page<EarningsDataDto> getEarningsTrends(
            Optional<Long> affiliateId,
            Optional<Long> clientId,
            String period,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate,
            Pageable pageable) {

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(12));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        List<Commission> commissions;

        if (affiliateId.isPresent()) {
            commissions = commissionRepository.findByAffiliateIdAndCreatedAtBetween(
                    affiliateId.get(), start, end);
        } else if (clientId.isPresent()) {
            commissions = commissionRepository.findByAffiliateClientIdAndCreatedAtBetween(
                    clientId.get(), start, end);
        } else {
            commissions = commissionRepository.findByCreatedAtBetweenAsList(start, end);
        }

        List<EarningsDataDto> allData = buildEarningsData(commissions, period, start, end);

        int startIndex = (int) pageable.getOffset();
        int endIndex = Math.min(startIndex + pageable.getPageSize(), allData.size());
        List<EarningsDataDto> pagedData = allData.subList(startIndex, endIndex);

        return new PageImpl<>(pagedData, pageable, allData.size());
    }

    @Override
    public EarningsTrendDto getAffiliateEarnings(
            Long affiliateId,
            String period,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate) {

        Affiliate affiliate = affiliateRepository.findById(affiliateId)
                .orElseThrow(() -> new AffiliateNotFoundException(
                        "Affiliate not found with ID: " + affiliateId));

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(12));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        Page<Commission> commissionPage = commissionRepository.findByCreatedAtBetween(start, end, Pageable.unpaged());
        List<Commission> commissions = commissionPage.getContent().stream()
                .filter(c -> c.getAffiliate().getId().equals(affiliateId))
                .toList();

        List<EarningsDataDto> data = buildEarningsData(commissions, period, start, end);

        BigDecimal totalDesktop = data.stream()
                .map(EarningsDataDto::getDesktop)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMobile = data.stream()
                .map(EarningsDataDto::getMobile)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalEarnings = totalDesktop.add(totalMobile);

        BigDecimal growthRate = calculateGrowthRate(data);

        return EarningsTrendDto.builder()
                .affiliateId(affiliateId)
                .affiliateName(affiliate.getName())
                .periodStart(start)
                .periodEnd(end)
                .totalDesktop(totalDesktop)
                .totalMobile(totalMobile)
                .totalEarnings(totalEarnings)
                .growthRate(growthRate)
                .data(data)
                .build();
    }

    @Override
    public EarningsTrendDto getEarningsSummary(
            Optional<Long> clientId,
            String period,
            Optional<LocalDateTime> startDate,
            Optional<LocalDateTime> endDate) {

        LocalDateTime start = startDate.orElse(LocalDateTime.now().minusMonths(12));
        LocalDateTime end = endDate.orElse(LocalDateTime.now());

        Page<Commission> commissionPage = commissionRepository.findByCreatedAtBetween(start, end, Pageable.unpaged());
        List<Commission> commissions;

        if (clientId.isPresent()) {
            commissions = commissionPage.getContent().stream()
                    .filter(c -> c.getAffiliate().getClient().getId().equals(clientId.get()))
                    .toList();
        } else {
            commissions = commissionPage.getContent();
        }

        List<EarningsDataDto> data = buildEarningsData(commissions, period, start, end);

        BigDecimal totalDesktop = data.stream()
                .map(EarningsDataDto::getDesktop)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMobile = data.stream()
                .map(EarningsDataDto::getMobile)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalEarnings = totalDesktop.add(totalMobile);

        BigDecimal growthRate = calculateGrowthRate(data);

        return EarningsTrendDto.builder()
                .periodStart(start)
                .periodEnd(end)
                .totalDesktop(totalDesktop)
                .totalMobile(totalMobile)
                .totalEarnings(totalEarnings)
                .growthRate(growthRate)
                .data(data)
                .build();
    }

    private List<EarningsDataDto> buildEarningsData(
            List<Commission> commissions,
            String period,
            LocalDateTime start,
            LocalDateTime end) {

        if ("monthly".equals(period)) {
            return buildMonthlyData(commissions, start, end);
        } else if ("weekly".equals(period)) {
            return buildWeeklyData(commissions, start, end);
        } else {
            return buildDailyData(commissions, start, end);
        }
    }

    private List<EarningsDataDto> buildMonthlyData(
            List<Commission> commissions,
            LocalDateTime start,
            LocalDateTime end) {

        List<EarningsDataDto> result = new ArrayList<>();

        LocalDateTime current = start.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        while (current.isBefore(end) || current.equals(end.withDayOfMonth(1))) {
            final LocalDateTime monthStart = current;
            final LocalDateTime monthEnd = current.plusMonths(1).minusDays(1);

            List<Commission> monthlyCommissions = commissions.stream()
                    .filter(c -> !c.getCreatedAt().isBefore(monthStart) &&
                            !c.getCreatedAt().isAfter(monthEnd))
                    .toList();

            BigDecimal desktopEarnings = calculateDesktopEarnings(monthlyCommissions);
            BigDecimal mobileEarnings = calculateMobileEarnings(monthlyCommissions);

            result.add(EarningsDataDto.builder()
                    .period(Month.from(monthStart).getDisplayName(TextStyle.FULL, Locale.ENGLISH))
                    .desktop(desktopEarnings)
                    .mobile(mobileEarnings)
                    .total(desktopEarnings.add(mobileEarnings))
                    .periodStart(monthStart)
                    .periodEnd(monthEnd)
                    .build());

            current = current.plusMonths(1);
        }

        return result;
    }

    private List<EarningsDataDto> buildWeeklyData(
            List<Commission> commissions,
            LocalDateTime start,
            LocalDateTime end) {

        List<EarningsDataDto> result = new ArrayList<>();
        LocalDateTime current = start;

        int weekNumber = 1;
        while (current.isBefore(end)) {
            final LocalDateTime weekStart = current;
            LocalDateTime weekEnd = current.plusWeeks(1).minusDays(1);
            if (weekEnd.isAfter(end)) {
                weekEnd = end;
            }
            final LocalDateTime finalWeekEnd = weekEnd;

            List<Commission> weeklyCommissions = commissions.stream()
                    .filter(c -> !c.getCreatedAt().isBefore(weekStart) &&
                            !c.getCreatedAt().isAfter(finalWeekEnd))
                    .toList();

            BigDecimal desktopEarnings = calculateDesktopEarnings(weeklyCommissions);
            BigDecimal mobileEarnings = calculateMobileEarnings(weeklyCommissions);

            result.add(EarningsDataDto.builder()
                    .period("Week " + weekNumber)
                    .desktop(desktopEarnings)
                    .mobile(mobileEarnings)
                    .total(desktopEarnings.add(mobileEarnings))
                    .periodStart(weekStart)
                    .periodEnd(finalWeekEnd)
                    .build());

            current = current.plusWeeks(1);
            weekNumber++;
        }

        return result;
    }

    private List<EarningsDataDto> buildDailyData(
            List<Commission> commissions,
            LocalDateTime start,
            LocalDateTime end) {

        List<EarningsDataDto> result = new ArrayList<>();
        LocalDateTime current = start;

        while (current.isBefore(end) || current.toLocalDate().equals(end.toLocalDate())) {
            final LocalDateTime dayStart = current;
            final LocalDateTime dayEnd = current.withHour(23).withMinute(59).withSecond(59);

            List<Commission> dailyCommissions = commissions.stream()
                    .filter(c -> c.getCreatedAt().toLocalDate().equals(dayStart.toLocalDate()))
                    .toList();

            BigDecimal desktopEarnings = calculateDesktopEarnings(dailyCommissions);
            BigDecimal mobileEarnings = calculateMobileEarnings(dailyCommissions);

            result.add(EarningsDataDto.builder()
                    .period(dayStart.toLocalDate().toString())
                    .desktop(desktopEarnings)
                    .mobile(mobileEarnings)
                    .total(desktopEarnings.add(mobileEarnings))
                    .periodStart(dayStart)
                    .periodEnd(dayEnd)
                    .build());

            current = current.plusDays(1);
        }

        return result;
    }

    private BigDecimal calculateDesktopEarnings(List<Commission> commissions) {
        return commissions.stream()
                .filter(c -> "DESKTOP".equalsIgnoreCase(getDeviceType(c)))
                .map(Commission::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateMobileEarnings(List<Commission> commissions) {
        return commissions.stream()
                .filter(c -> "MOBILE".equalsIgnoreCase(getDeviceType(c)))
                .map(Commission::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String getDeviceType(Commission commission) {
        // Since Commission doesn't have deviceType, we'll simulate it
        // In a real implementation, you'd get this from the referral or commission data
        return commission.getId() % 2 == 0 ? "DESKTOP" : "MOBILE";
    }

    private BigDecimal calculateGrowthRate(List<EarningsDataDto> data) {
        if (data.size() < 2) {
            return BigDecimal.ZERO;
        }

        BigDecimal firstPeriod = data.get(0).getTotal();
        BigDecimal lastPeriod = data.get(data.size() - 1).getTotal();

        if (firstPeriod.equals(BigDecimal.ZERO)) {
            return BigDecimal.ZERO;
        }

        return lastPeriod.subtract(firstPeriod)
                .divide(firstPeriod, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}