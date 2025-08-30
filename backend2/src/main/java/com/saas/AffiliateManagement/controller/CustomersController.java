package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.exceptions.InvalidReferralDataException;
import com.saas.AffiliateManagement.exceptions.ReferralNotFoundException;
import com.saas.AffiliateManagement.models.dto.ConversionRateDto;
import com.saas.AffiliateManagement.models.dto.ReferralCustomerDTO;
import com.saas.AffiliateManagement.models.dto.ReferralDto;
import com.saas.AffiliateManagement.models.requests.ReferralCreateRequest;
import com.saas.AffiliateManagement.models.requests.ReferralUpdateRequest;
import com.saas.AffiliateManagement.models.responses.ReferralTrackingResponse;
import com.saas.AffiliateManagement.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * REST Controller for managing Referral entities.
 * Handles HTTP requests for referral tracking, conversion management,
 * and analytics functionality.
 *
 * @author Vladislavs Kraslavskis
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/referrals")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class CustomersController {

    private final CustomerService referralService;

    /**
     * Constructor for dependency injection.
     *
     * @param referralService the referral service to handle business logic
     */
    @Autowired
    public CustomersController(CustomerService referralService) {
        this.referralService = referralService;
    }

    /**
     * Tracks a new referral click.
     *
     * @param createRequest the referral creation request
     * @param request the HTTP servlet request for extracting tracking data
     * @return ResponseEntity containing the created referral DTO
     * @throws InvalidReferralDataException if the provided data is invalid
     */
    @PostMapping("/track")
    public ResponseEntity<ReferralDto> trackReferral(
            @Valid @RequestBody ReferralCreateRequest createRequest,
            HttpServletRequest request) {

        String userAgent = request.getHeader("User-Agent");
        String ipAddress = getClientIpAddress(request);

        ReferralDto trackedReferral = referralService
                .trackReferral(createRequest, userAgent, ipAddress);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trackedReferral);
    }

    /**
     * Tracks multiple referrals in a batch operation.
     *
     * @param createRequests the list of referral creation requests
     * @param request the HTTP servlet request for extracting tracking data
     * @return ResponseEntity containing the list of created referral DTOs
     * @throws InvalidReferralDataException if any provided data is invalid
     */
    @PostMapping("/track/batch")
    public ResponseEntity<List<ReferralDto>> trackBatchReferrals(
            @Valid @RequestBody List<ReferralCreateRequest> createRequests,
            HttpServletRequest request) {

        String userAgent = request.getHeader("User-Agent");
        String ipAddress = getClientIpAddress(request);

        List<ReferralDto> trackedReferrals = referralService
                .trackBatchReferrals(createRequests, userAgent, ipAddress);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trackedReferrals);
    }

    /**
     * Retrieves a referral by its unique identifier.
     *
     * @param referralId the unique identifier of the referral
     * @return ResponseEntity containing the referral DTO if found
     * @throws ReferralNotFoundException if no referral exists with the given ID
     */
    @GetMapping("/{referralId}")
    public ResponseEntity<ReferralDto> getReferralById(
            @PathVariable @Min(1) Long referralId) {

        ReferralDto referral = referralService.getReferralById(referralId);
        return ResponseEntity.ok(referral);
    }

    /**
     * Retrieves a referral by its referral code.
     *
     * @param referralCode the referral code
     * @return ResponseEntity containing the referral DTO if found
     * @throws ReferralNotFoundException if no referral exists with the given code
     */
    @GetMapping("/code/{referralCode}")
    public ResponseEntity<ReferralDto> getReferralByCode(
            @PathVariable String referralCode) {

        ReferralDto referral = referralService.getReferralByCode(referralCode);
        return ResponseEntity.ok(referral);
    }

    /**
     * Searches for referrals based on various criteria.
     *
     * @param status optional status filter
     * @param affiliateId optional affiliate ID filter
     * @param referralCode optional referral code filter
     * @param pageable pagination information
     * @return ResponseEntity containing a page of matching referral DTOs
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ReferralDto>> searchReferrals(
            @RequestParam Optional<String> status,
            @RequestParam Optional<Long> affiliateId,
            @RequestParam Optional<String> referralCode,
            Pageable pageable) {

        Page<ReferralDto> searchResults = referralService.searchReferrals(status, affiliateId, referralCode, pageable);

        return ResponseEntity.ok(searchResults);
    }

    /**
     * Retrieves all referrals for a specific affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param status optional status filter
     * @param startDate optional start date filter
     * @param endDate optional end date filter
     * @param pageable pagination information
     * @return ResponseEntity containing a page of referral DTOs
     */
    @GetMapping("/affiliate/{affiliateId}")
    public ResponseEntity<Page<ReferralDto>> getReferralsByAffiliate(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam Optional<String> status,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate,
            Pageable pageable) {

        Page<ReferralDto> referrals = referralService
                .getReferralsByAffiliateId(affiliateId, status, startDate, endDate, pageable);

        return ResponseEntity.ok(referrals);
    }

    /**
     * Updates an existing referral.
     *
     * @param referralId the unique identifier of the referral to update
     * @param updateRequest the referral update request
     * @return ResponseEntity containing the updated referral DTO
     * @throws ReferralNotFoundException if no referral exists with the given ID
     * @throws InvalidReferralDataException if the provided data is invalid
     */
    @PutMapping("/{referralId}")
    public ResponseEntity<ReferralDto> updateReferral(
            @PathVariable @Min(1) Long referralId,
            @Valid @RequestBody ReferralUpdateRequest updateRequest) {

        ReferralDto updatedReferral = referralService
                .updateReferral(referralId, updateRequest);

        return ResponseEntity.ok(updatedReferral);
    }

    /**
     * Deletes a referral.
     *
     * @param referralId the unique identifier of the referral to delete
     * @return ResponseEntity with no content
     * @throws ReferralNotFoundException if no referral exists with the given ID
     */
    @DeleteMapping("/{referralId}")
    public ResponseEntity<Void> deleteReferral(
            @PathVariable @Min(1) Long referralId) {

        referralService.deleteReferral(referralId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Converts a referral to a sale.
     *
     * @param referralId the unique identifier of the referral
     * @param conversionValue the monetary value of the conversion
     * @param orderId optional order ID for the conversion
     * @return ResponseEntity containing the updated referral DTO
     * @throws ReferralNotFoundException if no referral exists with the given ID
     */
    @PatchMapping("/{referralId}/convert")
    public ResponseEntity<ReferralDto> convertReferral(
            @PathVariable @Min(1) Long referralId,
            @RequestParam @Min(0) BigDecimal conversionValue,
            @RequestParam Optional<String> orderId) {

        ReferralDto convertedReferral = referralService
                .convertReferral(referralId, conversionValue, orderId);

        return ResponseEntity.ok(convertedReferral);
    }

    /**
     * Cancels a referral conversion.
     *
     * @param referralId the unique identifier of the referral
     * @return ResponseEntity containing the updated referral DTO
     * @throws ReferralNotFoundException if no referral exists with the given ID
     */
    @PatchMapping("/{referralId}/cancel-conversion")
    public ResponseEntity<ReferralDto> cancelConversion(
            @PathVariable @Min(1) Long referralId) {

        ReferralDto cancelledReferral = referralService
                .cancelConversion(referralId);

        return ResponseEntity.ok(cancelledReferral);
    }

    /**
     * Expires a referral.
     *
     * @param referralId the unique identifier of the referral
     * @return ResponseEntity containing the updated referral DTO
     * @throws ReferralNotFoundException if no referral exists with the given ID
     */
    @PatchMapping("/{referralId}/expire")
    public ResponseEntity<ReferralDto> expireReferral(
            @PathVariable @Min(1) Long referralId) {

        ReferralDto expiredReferral = referralService
                .expireReferral(referralId);

        return ResponseEntity.ok(expiredReferral);
    }

    /**
     * Retrieves referral tracking statistics for an affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param startDate optional start date for the statistics period
     * @param endDate optional end date for the statistics period
     * @return ResponseEntity containing tracking statistics
     */
    @GetMapping("/affiliate/{affiliateId}/statistics")
    public ResponseEntity<ReferralTrackingResponse> getReferralStatistics(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate) {

        ReferralTrackingResponse statistics = referralService
                .getReferralStatistics(affiliateId, startDate, endDate);

        return ResponseEntity.ok(statistics);
    }

    /**
     * Retrieves top performing referral links for an affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param limit the maximum number of results to return
     * @param startDate optional start date for the period
     * @param endDate optional end date for the period
     * @return ResponseEntity containing a list of top performing referrals
     */
    @GetMapping("/affiliate/{affiliateId}/top-performing")
    public ResponseEntity<List<ReferralDto>> getTopPerformingReferrals(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam(defaultValue = "10") @Min(1) Integer limit,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate) {

        List<ReferralDto> topReferrals = referralService
                .getTopPerformingReferrals(affiliateId, limit, startDate, endDate);

        return ResponseEntity.ok(topReferrals);
    }

    /**
     * Retrieves conversion rate analytics for an affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param period the time period for analytics
     * @param startDate optional start date for the period
     * @param endDate optional end date for the period
     * @return ResponseEntity containing conversion rate data
     */
    @GetMapping("/affiliate/{affiliateId}/conversion-rates")
    public ResponseEntity<ConversionRateDto> getConversionRateAnalytics(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate) {

        ConversionRateDto conversionRates = referralService
                .getConversionRateAnalytics(affiliateId, period, startDate, endDate);

        return ResponseEntity.ok(conversionRates);
    }

    /**
     * Calculates total revenue for an affiliate within a date range.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param startDate the start date for the calculation period
     * @param endDate the end date for the calculation period
     * @return ResponseEntity containing the total revenue
     */
    @GetMapping("/affiliate/{affiliateId}/total-revenue")
    public ResponseEntity<BigDecimal> calculateTotalRevenue(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate) {

        BigDecimal totalRevenue = referralService
                .calculateTotalRevenueForAffiliate(affiliateId, startDate, endDate);

        return ResponseEntity.ok(totalRevenue);
    }

    /**
     * Retrieves pending conversions.
     *
     * @param affiliateId optional affiliate ID filter
     * @param daysOld optional number of days old filter
     * @param pageable pagination information
     * @return ResponseEntity containing a page of pending conversion DTOs
     */
    @GetMapping("/pending-conversions")
    public ResponseEntity<Page<ReferralDto>> getPendingConversions(
            @RequestParam Optional<Long> affiliateId,
            @RequestParam Optional<Integer> daysOld,
            Pageable pageable) {

        Page<ReferralDto> pendingConversions = referralService
                .getPendingConversions(affiliateId, daysOld, pageable);

        return ResponseEntity.ok(pendingConversions);
    }

    /**
     * Retrieves referral trends over a specified period.
     *
     * @param days the number of days to analyze
     * @param affiliateId optional affiliate ID filter
     * @return ResponseEntity containing trend analysis data
     */
    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getReferralTrends(
            @RequestParam(defaultValue = "30") Integer days,
            @RequestParam Optional<Long> affiliateId) {

        Map<String, Object> trends = referralService
                .getReferralTrends(days, affiliateId);

        return ResponseEntity.ok(trends);
    }

    /**
     * Retrieves referral source analytics.
     *
     * @param affiliateId optional affiliate ID filter
     * @param startDate optional start date for the analysis period
     * @param endDate optional end date for the analysis period
     * @return ResponseEntity containing source analytics data
     */
    @GetMapping("/source-analytics")
    public ResponseEntity<Map<String, Long>> getReferralSourceAnalytics(
            @RequestParam Optional<Long> affiliateId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            Optional<LocalDateTime> endDate) {

        Map<String, Long> sourceAnalytics = referralService
                .getReferralSourceAnalytics(affiliateId, startDate, endDate);

        return ResponseEntity.ok(sourceAnalytics);
    }

    @GetMapping("/client/{clientId}/customers")
    public ResponseEntity<Page<ReferralCustomerDTO>> getCustomersByClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            @RequestParam(required = false) String search) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ReferralCustomerDTO> customers = search != null && !search.trim().isEmpty()
                ? referralService.searchReferralCustomersByClient(clientId, search, pageable)
                : referralService.getReferralCustomersByClient(clientId, pageable);

        return ResponseEntity.ok(customers);
    }


    /**
     * Extracts the client IP address from the HTTP request.
     * Handles cases where the request passes through proxies or load balancers.
     *
     * @param request the HTTP servlet request
     * @return the client IP address as a string
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}