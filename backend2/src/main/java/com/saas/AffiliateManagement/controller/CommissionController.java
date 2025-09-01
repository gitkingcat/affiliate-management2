// =============================================================================

package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.exceptions.CommissionNotFoundException;
import com.saas.AffiliateManagement.exceptions.InvalidCommissionDataException;
import com.saas.AffiliateManagement.models.requests.CommissionCreateRequest;
import com.saas.AffiliateManagement.models.dto.CommissionDto;
import com.saas.AffiliateManagement.models.requests.CommissionUpdateRequest;
import com.saas.AffiliateManagement.service.CommissionService;


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

/**
 * REST Controller for managing Commission entities.
 * Handles HTTP requests for commission operations including tracking,
 * calculation, and reporting functionality.
 *
 * @author Vladislavs Kraslavskis
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/commissions")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommissionController {

    private final CommissionService commissionService;

    /**
     * Constructor for dependency injection.
     *
     * @param commissionService the commission service to handle business logic
     */
    @Autowired
    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    /**
     * Creates a new commission record.
     *
     * @param createRequest the commission creation request
     * @return ResponseEntity containing the created commission DTO
     * @throws InvalidCommissionDataException if the provided data is invalid
     */
    @PostMapping
    public ResponseEntity<CommissionDto> createCommission(
            @Valid @RequestBody CommissionCreateRequest createRequest) {

        CommissionDto createdCommission = commissionService
                .createCommission(createRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createdCommission);
    }

    /**
     * Retrieves a commission by its unique identifier.
     *
     * @param commissionId the unique identifier of the commission
     * @return ResponseEntity containing the commission DTO if found
     * @throws CommissionNotFoundException if no commission exists with given ID
     */
    @GetMapping("/{commissionId}")
    public ResponseEntity<CommissionDto> getCommissionById(
            @PathVariable @Min(1) Long commissionId) {

        CommissionDto commission = commissionService
                .getCommissionById(commissionId);

        return ResponseEntity.ok(commission);
    }

    /**
     * Retrieves all commissions for a specific affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param pageable pagination information
     * @return ResponseEntity containing a page of commission DTOs
     */
    @GetMapping("/affiliate/{affiliateId}")
    public ResponseEntity<Page<CommissionDto>> getCommissionsByAffiliate(
            @PathVariable @Min(1) Long affiliateId,
            Pageable pageable) {

        Page<CommissionDto> commissions = commissionService
                .getCommissionsByAffiliateId(affiliateId, pageable);

        return ResponseEntity.ok(commissions);
    }

    /**
     * Updates an existing commission record.
     *
     * @param commissionId the unique identifier of the commission to update
     * @param updateRequest the commission update request
     * @return ResponseEntity containing the updated commission DTO
     * @throws CommissionNotFoundException if no commission exists with given ID
     * @throws InvalidCommissionDataException if the provided data is invalid
     */
    @PutMapping("/{commissionId}")
    public ResponseEntity<CommissionDto> updateCommission(
            @PathVariable @Min(1) Long commissionId,
            @Valid @RequestBody CommissionUpdateRequest updateRequest) {

        CommissionDto updatedCommission = commissionService
                .updateCommission(commissionId, updateRequest);

        return ResponseEntity.ok(updatedCommission);
    }

    /**
     * Calculates total commission earnings for an affiliate within a date range.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param startDate the start date for the calculation period
     * @param endDate the end date for the calculation period
     * @return ResponseEntity containing the total commission amount
     */
    @GetMapping("/affiliate/{affiliateId}/total")
    public ResponseEntity<BigDecimal> calculateTotalCommission(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate) {

        BigDecimal totalCommission = commissionService
                .calculateTotalCommissionForAffiliate(affiliateId, startDate, endDate);

        return ResponseEntity.ok(totalCommission);
    }

    /**
     * Retrieves pending commission payments for an affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param pageable pagination information
     * @return ResponseEntity containing a page of pending commission DTOs
     */
    @GetMapping("/affiliate/{affiliateId}/pending")
    public ResponseEntity<Page<CommissionDto>> getPendingCommissions(
            @PathVariable @Min(1) Long affiliateId,
            Pageable pageable) {

        Page<CommissionDto> pendingCommissions = commissionService
                .getPendingCommissionsByAffiliateId(affiliateId, pageable);

        return ResponseEntity.ok(pendingCommissions);
    }

    /**
     * Marks a commission as paid.
     *
     * @param commissionId the unique identifier of the commission
     * @return ResponseEntity containing the updated commission DTO
     * @throws CommissionNotFoundException if no commission exists with given ID
     */
    @PatchMapping("/{commissionId}/mark-paid")
    public ResponseEntity<CommissionDto> markCommissionAsPaid(
            @PathVariable @Min(1) Long commissionId) {

        CommissionDto paidCommission = commissionService
                .markCommissionAsPaid(commissionId);

        return ResponseEntity.ok(paidCommission);
    }

    @GetMapping("/client/{clientId}/tab-data")
    public ResponseEntity<Page<CommissionDto>> getCommissionsByClient(
            @PathVariable("clientId") String clientIdStr,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "affiliateName", required = false) String affiliateName,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDirection", defaultValue = "desc") String sortDirection) {

        Long clientId = parseClientId(clientIdStr);

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ?
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<CommissionDto> commissions = commissionService
                .getFilteredCommissionsByClient(clientId, status, type, affiliateName, search, pageable);

        return ResponseEntity.ok(commissions);
    }

    private Long parseClientId(String clientIdStr) {
        if (clientIdStr == null || clientIdStr.trim().isEmpty()) {
            throw new IllegalArgumentException("Client ID cannot be empty");
        }

        try {
            return Long.parseLong(clientIdStr.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid client ID format: " + clientIdStr);
        }
    }

}