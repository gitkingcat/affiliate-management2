package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.models.requests.AffiliateCreateRequest;
import com.saas.AffiliateManagement.models.dto.AffiliateDto;
import com.saas.AffiliateManagement.models.requests.AffiliateUpdateRequest;
import com.saas.AffiliateManagement.service.AffiliateService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/affiliates")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class AffiliateController {

    private final AffiliateService affiliateService;

    @Autowired
    public AffiliateController(AffiliateService affiliateService) {
        this.affiliateService = affiliateService;
    }

    @PostMapping
    public ResponseEntity<AffiliateDto> createAffiliate(
            @Valid @RequestBody AffiliateCreateRequest createRequest) {

        AffiliateDto createdAffiliate = affiliateService
                .createAffiliate(createRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdAffiliate);
    }

    @GetMapping("/{affiliateId}")
    public ResponseEntity<AffiliateDto> getAffiliateById(
            @PathVariable @Min(1) Long affiliateId) {

        AffiliateDto affiliate = affiliateService
                .getAffiliateById(affiliateId);

        return ResponseEntity.ok(affiliate);
    }

    @GetMapping
    public ResponseEntity<Page<AffiliateDto>> getAllAffiliates(
            Pageable pageable) {

        Page<AffiliateDto> affiliates = affiliateService
                .getAllAffiliates(pageable);

        return ResponseEntity.ok(affiliates);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<AffiliateDto>> getAffiliatesByClient(
            @PathVariable @Min(1) Long clientId,
            Pageable pageable) {

        Page<AffiliateDto> affiliates = affiliateService
                .getAffiliatesByClientId(clientId, pageable);

        return ResponseEntity.ok(affiliates);
    }

    @PutMapping("/{affiliateId}")
    public ResponseEntity<AffiliateDto> updateAffiliate(
            @PathVariable @Min(1) Long affiliateId,
            @Valid @RequestBody AffiliateUpdateRequest updateRequest) {

        AffiliateDto updatedAffiliate = affiliateService
                .updateAffiliate(affiliateId, updateRequest);

        return ResponseEntity.ok(updatedAffiliate);
    }

    @DeleteMapping("/{affiliateId}")
    public ResponseEntity<Void> deleteAffiliate(
            @PathVariable @Min(1) Long affiliateId) {

        affiliateService.deleteAffiliate(affiliateId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{affiliateId}/activate")
    public ResponseEntity<AffiliateDto> activateAffiliate(
            @PathVariable @Min(1) Long affiliateId) {

        AffiliateDto activatedAffiliate = affiliateService
                .activateAffiliate(affiliateId);

        return ResponseEntity.ok(activatedAffiliate);
    }

    @PatchMapping("/{affiliateId}/deactivate")
    public ResponseEntity<AffiliateDto> deactivateAffiliate(
            @PathVariable @Min(1) Long affiliateId) {

        AffiliateDto deactivatedAffiliate = affiliateService
                .deactivateAffiliate(affiliateId);

        return ResponseEntity.ok(deactivatedAffiliate);
    }

    @PatchMapping("/{affiliateId}/approve")
    public ResponseEntity<AffiliateDto> approveAffiliate(
            @PathVariable @Min(1) Long affiliateId) {

        AffiliateDto approvedAffiliate = affiliateService
                .approveAffiliate(affiliateId);

        return ResponseEntity.ok(approvedAffiliate);
    }

    @PatchMapping("/{affiliateId}/reject")
    public ResponseEntity<AffiliateDto> rejectAffiliate(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam String reason) {

        AffiliateDto rejectedAffiliate = affiliateService
                .rejectAffiliate(affiliateId, reason);

        return ResponseEntity.ok(rejectedAffiliate);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AffiliateDto>> searchAffiliates(
            @RequestParam Optional<String> email,
            @RequestParam Optional<String> status,
            @RequestParam Optional<String> companyName,
            @RequestParam Optional<Long> clientId,
            Pageable pageable) {

        Page<AffiliateDto> searchResults = affiliateService
                .searchAffiliates(email, status, companyName, clientId, pageable);

        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/client/{clientId}/search")
    public ResponseEntity<Page<AffiliateDto>> searchClientAffiliates(
            @PathVariable @Min(1) Long clientId,
            @RequestParam Optional<String> email,
            @RequestParam Optional<String> status,
            @RequestParam Optional<String> companyName,
            Pageable pageable) {

        Page<AffiliateDto> searchResults = affiliateService
                .searchClientAffiliates(clientId, email, status, companyName, pageable);

        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/pending-approval")
    public ResponseEntity<Page<AffiliateDto>> getPendingApprovalAffiliates(
            Pageable pageable) {

        Page<AffiliateDto> pendingAffiliates = affiliateService
                .getPendingApprovalAffiliates(pageable);

        return ResponseEntity.ok(pendingAffiliates);
    }

    @GetMapping("/active")
    public ResponseEntity<Page<AffiliateDto>> getActiveAffiliates(
            Pageable pageable) {

        Page<AffiliateDto> activeAffiliates = affiliateService
                .getActiveAffiliates(pageable);

        return ResponseEntity.ok(activeAffiliates);
    }

    @GetMapping("/client/{clientId}/active")
    public ResponseEntity<Page<AffiliateDto>> getActiveAffiliatesByClient(
            @PathVariable @Min(1) Long clientId,
            Pageable pageable) {

        Page<AffiliateDto> activeAffiliates = affiliateService
                .getActiveAffiliatesByClientId(clientId, pageable);

        return ResponseEntity.ok(activeAffiliates);
    }

    @PostMapping("/{affiliateId}/generate-referral-code")
    public ResponseEntity<String> generateReferralCode(
            @PathVariable @Min(1) Long affiliateId) {

        String referralCode = affiliateService
                .generateReferralCode(affiliateId);

        return ResponseEntity.ok(referralCode);
    }

    @PostMapping("/{affiliateId}/regenerate-referral-code")
    public ResponseEntity<String> regenerateReferralCode(
            @PathVariable @Min(1) Long affiliateId) {

        String newReferralCode = affiliateService
                .regenerateReferralCode(affiliateId);

        return ResponseEntity.ok(newReferralCode);
    }
}