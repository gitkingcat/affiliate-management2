// =============================================================================
package com.saas.AffiliateManagement.controller;

import com.saas.AffiliateManagement.exceptions.InvalidPaymentDataException;
import com.saas.AffiliateManagement.exceptions.PaymentNotFoundException;
import com.saas.AffiliateManagement.exceptions.PaymentProcessingException;
import com.saas.AffiliateManagement.models.requests.PaymentBatchRequest;
import com.saas.AffiliateManagement.models.requests.PaymentCreateRequest;
import com.saas.AffiliateManagement.models.dto.PaymentDto;
import com.saas.AffiliateManagement.service.PaymentService;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST Controller for managing Payment entities.
 * Handles HTTP requests for payment processing, tracking,
 * and financial reporting functionality.
 *
 * @author Vladislavs Kraslavskis
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/payments")
@Validated
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Constructor for dependency injection.
     *
     * @param paymentService the payment service to handle business logic
     */
    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Processes a new payment to an affiliate.
     * Requires administrative privileges.
     *
     * @param createRequest the payment creation request
     * @return ResponseEntity containing the processed payment DTO
     * @throws InvalidPaymentDataException if the provided data is invalid
     * @throws PaymentProcessingException if payment processing fails
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDto> processPayment(
            @Valid @RequestBody PaymentCreateRequest createRequest) {

        PaymentDto processedPayment = paymentService
                .processPayment(createRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(processedPayment);
    }

    /**
     * Processes multiple payments in a batch operation.
     * Requires administrative privileges.
     *
     * @param batchRequest the batch payment request containing multiple payments
     * @return ResponseEntity containing a list of processed payment DTOs
     * @throws InvalidPaymentDataException if any payment data is invalid
     * @throws PaymentProcessingException if batch processing fails
     */
    @PostMapping("/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDto>> processBatchPayments(
            @Valid @RequestBody PaymentBatchRequest batchRequest) {

        List<PaymentDto> processedPayments = paymentService
                .processBatchPayments(batchRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(processedPayments);
    }

    /**
     * Retrieves a payment by its unique identifier.
     *
     * @param paymentId the unique identifier of the payment
     * @return ResponseEntity containing the payment DTO if found
     * @throws PaymentNotFoundException if no payment exists with the given ID
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDto> getPaymentById(
            @PathVariable @Min(1) Long paymentId) {

        PaymentDto payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }

    /**
     * Retrieves all payments for a specific affiliate.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param pageable pagination information
     * @return ResponseEntity containing a page of payment DTOs
     */
    @GetMapping("/affiliate/{affiliateId}")
    public ResponseEntity<Page<PaymentDto>> getPaymentsByAffiliate(
            @PathVariable @Min(1) Long affiliateId,
            Pageable pageable) {

        Page<PaymentDto> payments = paymentService
                .getPaymentsByAffiliateId(affiliateId, pageable);

        return ResponseEntity.ok(payments);
    }

    /**
     * Retrieves payments within a specified date range.
     * Requires administrative privileges.
     *
     * @param startDate the start date for the search period
     * @param endDate the end date for the search period
     * @param status optional payment status filter
     * @param pageable pagination information
     * @return ResponseEntity containing a page of payment DTOs
     */
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentDto>> getPaymentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate,
            @RequestParam Optional<String> status,
            Pageable pageable) {

        Page<PaymentDto> payments = paymentService
                .getPaymentsByDateRange(startDate, endDate, status, pageable);

        return ResponseEntity.ok(payments);
    }

    /**
     * Calculates the total payment amount for an affiliate within a date range.
     *
     * @param affiliateId the unique identifier of the affiliate
     * @param startDate the start date for the calculation period
     * @param endDate the end date for the calculation period
     * @return ResponseEntity containing the total payment amount
     */
    @GetMapping("/affiliate/{affiliateId}/total")
    public ResponseEntity<BigDecimal> calculateTotalPayments(
            @PathVariable @Min(1) Long affiliateId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate) {

        BigDecimal totalPayments = paymentService
                .calculateTotalPaymentsForAffiliate(affiliateId, startDate, endDate);

        return ResponseEntity.ok(totalPayments);
    }

    /**
     * Retrieves pending payments that require processing.
     * Requires administrative privileges.
     *
     * @param pageable pagination information
     * @return ResponseEntity containing a page of pending payment DTOs
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentDto>> getPendingPayments(
            Pageable pageable) {

        Page<PaymentDto> pendingPayments = paymentService
                .getPendingPayments(pageable);

        return ResponseEntity.ok(pendingPayments);
    }

    /**
     * Updates the status of a payment.
     * Requires administrative privileges.
     *
     * @param paymentId the unique identifier of the payment
     * @param newStatus the new status to set
     * @return ResponseEntity containing the updated payment DTO
     * @throws PaymentNotFoundException if no payment exists with the given ID
     * @throws InvalidPaymentDataException if the new status is invalid
     */
    @PatchMapping("/{paymentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDto> updatePaymentStatus(
            @PathVariable @Min(1) Long paymentId,
            @RequestParam String newStatus) {

        PaymentDto updatedPayment = paymentService
                .updatePaymentStatus(paymentId, newStatus);

        return ResponseEntity.ok(updatedPayment);
    }

    /**
     * Generates a payment report for administrative purposes.
     * Requires administrative privileges.
     *
     * @param startDate the start date for the report period
     * @param endDate the end date for the report period
     * @param format the desired report format (e.g., "PDF", "CSV", "EXCEL")
     * @return ResponseEntity containing the generated report
     */
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> generatePaymentReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endDate,
            @RequestParam(defaultValue = "PDF") String format) {

        byte[] reportData = paymentService
                .generatePaymentReport(startDate, endDate, format);

        return ResponseEntity.ok()
                .header("Content-Type", getContentTypeForFormat(format))
                .header("Content-Disposition",
                        "attachment; filename=payment_report." + format.toLowerCase())
                .body(reportData);
    }

    /**
     * Determines the appropriate content type based on the report format.
     *
     * @param format the report format
     * @return the corresponding MIME type
     */
    private String getContentTypeForFormat(String format) {
        switch (format.toUpperCase()) {
            case "PDF":
                return "application/pdf";
            case "CSV":
                return "text/csv";
            case "EXCEL":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            default:
                return "application/octet-stream";
        }
    }
}