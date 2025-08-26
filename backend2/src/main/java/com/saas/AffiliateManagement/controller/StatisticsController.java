package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.dto.DashboardStatisticsDto;
import com.saas.AffiliateManagement.models.dto.EarningsDataDto;
import com.saas.AffiliateManagement.models.dto.PeriodStatisticsDto;
import com.saas.AffiliateManagement.service.EarningsService;
import com.saas.AffiliateManagement.service.StatisticsService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/statistics")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatisticsController {

    private final EarningsService earningsService;

    private final StatisticsService statisticsService;

    @Autowired
    public StatisticsController(EarningsService earningsService, StatisticsService statisticsService) {
        this.earningsService = earningsService;
        this.statisticsService = statisticsService;
    }

    @GetMapping(value = "/trends", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<EarningsDataDto>> getEarningsTrends(
            @RequestParam Optional<Long> affiliateId,
            @RequestParam Optional<Long> clientId,
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate,
            Pageable pageable) {

        Page<EarningsDataDto> trends = earningsService
                .getEarningsTrends(affiliateId, clientId, period, startDate, endDate, pageable);

        return ResponseEntity.ok(trends);
    }

    @GetMapping("/dashboard/client/{clientId}")
    public ResponseEntity<DashboardStatisticsDto> getClientDashboardStats(
            @PathVariable @Min(1) Long clientId,
            @RequestParam(defaultValue = "30") Integer days) {

        DashboardStatisticsDto stats = statisticsService
                .getClientDashboardStatistics(clientId, days);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/affiliates/new-count")
    public ResponseEntity<Long> getNewAffiliatesCount(
            @RequestParam @Min(1) Long clientId,
            @RequestParam(defaultValue = "30") Integer days) {

        Long count = statisticsService
                .getNewAffiliatesCount(clientId, days);

        return ResponseEntity.ok(count);
    }

    @GetMapping("/affiliates/period-stats")
    public ResponseEntity<PeriodStatisticsDto> getAffiliatePeriodStats(
            @RequestParam @Min(1) Long clientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate) {

        PeriodStatisticsDto stats = statisticsService
                .getAffiliatePeriodStatistics(clientId, startDate, endDate);

        return ResponseEntity.ok(stats);
    }

}