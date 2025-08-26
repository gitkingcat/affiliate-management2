package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.dto.EarningsDataDto;
import com.saas.AffiliateManagement.service.EarningsService;
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
@RequestMapping("/api/v1/earnings")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class EarningsController {

    private final EarningsService earningsService;

    @Autowired
    public EarningsController(EarningsService earningsService) {
        this.earningsService = earningsService;
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

}