package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.dto.PayoutDto;
import com.saas.AffiliateManagement.service.PayoutService;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/clients/{clientId}/payouts")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
@AllArgsConstructor
public class PayoutController {

    private final PayoutService payoutService;

    @GetMapping
    public ResponseEntity<Page<PayoutDto>> getPayoutsForClient(
            @PathVariable @Min(1) Long clientId,
            @RequestParam(required = false) String partnerName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate commissionStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate commissionEnd,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<PayoutDto> payouts = payoutService.getPayoutsForClient(
                clientId, partnerName, email, status,
                commissionStart, commissionEnd, pageable);

        return ResponseEntity.ok(payouts);
    }
}