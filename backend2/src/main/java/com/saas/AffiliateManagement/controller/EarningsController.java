package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.dto.EarningsDataDto;
import com.saas.AffiliateManagement.models.dto.EarningsTrendDto;
import com.saas.AffiliateManagement.service.EarningsService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/earnings")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class EarningsController {

    private final EarningsService earningsService;

    @Autowired
    public EarningsController(EarningsService earningsService) {
        this.earningsService = earningsService;
    }

    @GetMapping("/trends")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT') or hasRole('AFFILIATE')")
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

    @GetMapping("/affiliate/{affiliateId}")
    @PreAuthorize("hasRole('ADMIN') or @affiliateService.isAffiliateOwnedByClient(#affiliateId, authentication.name)")
    public ResponseEntity<EarningsTrendDto> getAffiliateEarnings(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate) {

        EarningsTrendDto earnings = earningsService
                .getAffiliateEarnings(affiliateId, period, startDate, endDate);

        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<EarningsTrendDto> getEarningsSummary(
            @RequestParam Optional<Long> clientId,
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate) {

        EarningsTrendDto summary = earningsService
                .getEarningsSummary(clientId, period, startDate, endDate);

        return ResponseEntity.ok(summary);
    }
}