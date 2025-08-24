package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.AffiliateNotFoundException;
import com.saas.AffiliateManagement.exceptions.InvalidPaymentDataException;
import com.saas.AffiliateManagement.exceptions.PaymentNotFoundException;
import com.saas.AffiliateManagement.exceptions.PaymentProcessingException;
import com.saas.AffiliateManagement.models.dto.PaymentDto;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Payment;
import com.saas.AffiliateManagement.models.requests.PaymentBatchRequest;
import com.saas.AffiliateManagement.models.requests.PaymentCreateRequest;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.PaymentRepository;
import com.saas.AffiliateManagement.service.mappers.PaymentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AffiliateRepository affiliateRepository;
    private final PaymentMapper paymentMapper;
    private final ReportService reportService;

    @Transactional
    public PaymentDto processPayment(PaymentCreateRequest createRequest) {
        validatePaymentRequest(createRequest);

        Affiliate affiliate = findAffiliateById(createRequest.getAffiliateId());

        if (!"ACTIVE".equals(affiliate.getStatus())) {
            throw new PaymentProcessingException("Cannot process payment for inactive affiliate: " + affiliate.getId());
        }

        Payment payment = paymentMapper.toEntity(createRequest);
        payment.setAffiliate(affiliate);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setStatus("PENDING");

        try {
            Payment savedPayment = paymentRepository.save(payment);
            log.info("Processed payment with ID: {} for affiliate: {}", savedPayment.getId(), affiliate.getId());
            return paymentMapper.toDto(savedPayment);
        } catch (Exception e) {
            log.error("Failed to process payment for affiliate: {}", affiliate.getId(), e);
            throw new PaymentProcessingException("Failed to process payment: " + e.getMessage());
        }
    }

    @Transactional
    public List<PaymentDto> processBatchPayments(PaymentBatchRequest batchRequest) {
        validateBatchRequest(batchRequest);

        List<PaymentDto> processedPayments = batchRequest.getPayments().stream()
                .map(this::processPayment)
                .collect(Collectors.toList());

        log.info("Processed batch of {} payments", processedPayments.size());
        return processedPayments;
    }

    public PaymentDto getPaymentById(Long paymentId) {
        Payment payment = findPaymentById(paymentId);
        return paymentMapper.toDto(payment);
    }

    public Page<PaymentDto> getPaymentsByAffiliateId(Long affiliateId, Pageable pageable) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId);
        }

        Page<Payment> paymentsPage = paymentRepository.findByAffiliateId(affiliateId, pageable);
        return paymentsPage.map(paymentMapper::toDto);
    }

    public Page<PaymentDto> getPaymentsByDateRange(LocalDateTime startDate,
                                                   LocalDateTime endDate,
                                                   Optional<String> status,
                                                   Pageable pageable) {
        validateDateRange(startDate, endDate);

        Page<Payment> paymentsPage = status.isPresent()
                ? paymentRepository.findByCreatedAtBetweenAndStatus(startDate, endDate, status.get(), pageable)
                : paymentRepository.findByCreatedAtBetween(startDate, endDate, pageable);

        return paymentsPage.map(paymentMapper::toDto);
    }

    public BigDecimal calculateTotalPaymentsForAffiliate(Long affiliateId,
                                                         LocalDateTime startDate,
                                                         LocalDateTime endDate) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId);
        }

        validateDateRange(startDate, endDate);

        return paymentRepository.calculateTotalPaymentsForAffiliate(affiliateId, startDate, endDate)
                .orElse(BigDecimal.ZERO);
    }

    public Page<PaymentDto> getPendingPayments(Pageable pageable) {
        Page<Payment> pendingPayments = paymentRepository.findByStatus("PENDING", pageable);
        return pendingPayments.map(paymentMapper::toDto);
    }

    @Transactional
    public PaymentDto updatePaymentStatus(Long paymentId, String newStatus) {
        validatePaymentStatus(newStatus);

        Payment payment = findPaymentById(paymentId);
        String oldStatus = payment.getStatus();

        payment.setStatus(newStatus);
        payment.setUpdatedAt(LocalDateTime.now());

        if ("COMPLETED".equals(newStatus)) {
            payment.setProcessedAt(LocalDateTime.now());
        }

        Payment updatedPayment = paymentRepository.save(payment);
        log.info("Updated payment {} status from {} to {}", paymentId, oldStatus, newStatus);

        return paymentMapper.toDto(updatedPayment);
    }

    public byte[] generatePaymentReport(LocalDateTime startDate,
                                        LocalDateTime endDate,
                                        String format) {
        validateDateRange(startDate, endDate);
        validateReportFormat(format);

        List<Payment> payments = paymentRepository.findByCreatedAtBetween(startDate, endDate);

        try {
            return reportService.generatePaymentReport(payments, format);
        } catch (Exception e) {
            log.error("Failed to generate payment report", e);
            throw new PaymentProcessingException("Failed to generate report: " + e.getMessage());
        }
    }

    public List<PaymentDto> getRecentPaymentsByAffiliate(Long affiliateId, int limit) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId);
        }

        List<Payment> recentPayments = paymentRepository.findTopByAffiliateIdOrderByCreatedAtDesc(affiliateId, limit);
        return recentPayments.stream()
                .map(paymentMapper::toDto)
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalPaymentsByStatus(String status) {
        validatePaymentStatus(status);
        return paymentRepository.calculateTotalPaymentsByStatus(status)
                .orElse(BigDecimal.ZERO);
    }

    @Transactional
    public void cancelPayment(Long paymentId, String reason) {
        Payment payment = findPaymentById(paymentId);

        if ("COMPLETED".equals(payment.getStatus())) {
            throw new PaymentProcessingException("Cannot cancel completed payment: " + paymentId);
        }

        payment.setStatus("CANCELLED");
        payment.setCancellationReason(reason);
        payment.setUpdatedAt(LocalDateTime.now());

        paymentRepository.save(payment);
        log.info("Cancelled payment {} with reason: {}", paymentId, reason);
    }

    private Payment findPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException("Payment not found with ID: " + paymentId));
    }

    private Affiliate findAffiliateById(Long affiliateId) {
        return affiliateRepository.findById(affiliateId)
                .orElseThrow(() -> new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId));
    }

    private void validatePaymentRequest(PaymentCreateRequest createRequest) {
        if (createRequest.getAffiliateId() == null) {
            throw new InvalidPaymentDataException("Affiliate ID is required");
        }

        if (createRequest.getAmount() == null || createRequest.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentDataException("Payment amount must be greater than zero");
        }

        if (createRequest.getCurrency() == null || createRequest.getCurrency().trim().isEmpty()) {
            throw new InvalidPaymentDataException("Currency is required");
        }
    }

    private void validateBatchRequest(PaymentBatchRequest batchRequest) {
        if (batchRequest.getPayments() == null || batchRequest.getPayments().isEmpty()) {
            throw new InvalidPaymentDataException("Batch request must contain at least one payment");
        }

        if (batchRequest.getPayments().size() > 100) {
            throw new InvalidPaymentDataException("Batch size cannot exceed 100 payments");
        }
    }

    private void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            throw new InvalidPaymentDataException("Start date and end date are required");
        }

        if (startDate.isAfter(endDate)) {
            throw new InvalidPaymentDataException("Start date cannot be after end date");
        }
    }

    private void validatePaymentStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new InvalidPaymentDataException("Payment status is required");
        }

        if (!List.of("PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED").contains(status)) {
            throw new InvalidPaymentDataException("Invalid payment status: " + status);
        }
    }

    private void validateReportFormat(String format) {
        if (!List.of("PDF", "CSV", "EXCEL").contains(format.toUpperCase())) {
            throw new InvalidPaymentDataException("Unsupported report format: " + format);
        }
    }
}