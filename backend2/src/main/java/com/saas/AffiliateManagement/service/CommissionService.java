package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.AffiliateNotFoundException;
import com.saas.AffiliateManagement.exceptions.CommissionNotFoundException;
import com.saas.AffiliateManagement.exceptions.InvalidCommissionDataException;
import com.saas.AffiliateManagement.models.dto.CommissionDto;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.entity.Commission;
import com.saas.AffiliateManagement.models.requests.CommissionCreateRequest;
import com.saas.AffiliateManagement.models.requests.CommissionUpdateRequest;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.CommissionRepository;
import com.saas.AffiliateManagement.service.mappers.CommissionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final AffiliateRepository affiliateRepository;
    private final CommissionMapper commissionMapper;

    @Transactional
    public CommissionDto createCommission(CommissionCreateRequest createRequest) {
        validateCreateRequest(createRequest);

        Affiliate affiliate = findAffiliateById(createRequest.getAffiliateId());

        Commission commission = commissionMapper.toEntity(createRequest);
        commission.setAffiliate(affiliate);
        commission.setCreatedAt(LocalDateTime.now());
        commission.setUpdatedAt(LocalDateTime.now());
        commission.setStatus("PENDING");

        Commission savedCommission = commissionRepository.save(commission);
        log.info("Created new commission with ID: {} for affiliate: {}",
                savedCommission.getId(), affiliate.getId());

        return commissionMapper.toDto(savedCommission);
    }

    public CommissionDto getCommissionById(Long commissionId) {
        Commission commission = findCommissionById(commissionId);
        return commissionMapper.toDto(commission);
    }

    public Page<CommissionDto> getCommissionsByAffiliateId(Long affiliateId, Pageable pageable) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId);
        }

        Page<Commission> commissionsPage = commissionRepository
                .findByAffiliateId(affiliateId, pageable);

        return commissionsPage.map(commissionMapper::toDto);
    }

    @Transactional
    public CommissionDto updateCommission(Long commissionId, CommissionUpdateRequest updateRequest) {
        Commission commission = findCommissionById(commissionId);

        validateUpdateRequest(updateRequest);

        commissionMapper.updateEntityFromRequest(updateRequest, commission);
        commission.setUpdatedAt(LocalDateTime.now());

        Commission updatedCommission = commissionRepository.save(commission);
        log.info("Updated commission with ID: {}", commissionId);

        return commissionMapper.toDto(updatedCommission);
    }

    public BigDecimal calculateTotalCommissionForAffiliate(Long affiliateId,
                                                           LocalDateTime startDate, LocalDateTime endDate) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId);
        }

        BigDecimal totalCommission = commissionRepository
                .calculateTotalCommissionByAffiliateAndDateRange(affiliateId, startDate, endDate);

        return totalCommission != null ? totalCommission : BigDecimal.ZERO;
    }

    public Page<CommissionDto> getPendingCommissionsByAffiliateId(Long affiliateId, Pageable pageable) {
        if (!affiliateRepository.existsById(affiliateId)) {
            throw new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId);
        }

        Page<Commission> pendingCommissions = commissionRepository
                .findByAffiliateIdAndStatus(affiliateId, "PENDING", pageable);

        return pendingCommissions.map(commissionMapper::toDto);
    }

    @Transactional
    public CommissionDto markCommissionAsPaid(Long commissionId) {
        Commission commission = findCommissionById(commissionId);

        if ("PAID".equals(commission.getStatus())) {
            throw new InvalidCommissionDataException("Commission is already marked as paid");
        }

        commission.setStatus("PAID");
        commission.setPaidAt(LocalDateTime.now());
        commission.setUpdatedAt(LocalDateTime.now());

        Commission paidCommission = commissionRepository.save(commission);
        log.info("Marked commission as paid with ID: {}", commissionId);

        return commissionMapper.toDto(paidCommission);
    }

    public Page<CommissionDto> getCommissionsByStatus(String status, Pageable pageable) {
        Page<Commission> commissionsPage = commissionRepository.findByStatus(status, pageable);
        return commissionsPage.map(commissionMapper::toDto);
    }

    public BigDecimal calculateTotalCommissionByStatus(String status) {
        BigDecimal totalCommission = commissionRepository.calculateTotalCommissionByStatus(status);
        return totalCommission != null ? totalCommission : BigDecimal.ZERO;
    }

    @Transactional
    public void deleteCommission(Long commissionId) {
        if (!commissionRepository.existsById(commissionId)) {
            throw new CommissionNotFoundException("Commission not found with ID: " + commissionId);
        }

        commissionRepository.deleteById(commissionId);
        log.info("Deleted commission with ID: {}", commissionId);
    }

    @Transactional
    public CommissionDto updateCommissionStatus(Long commissionId, String newStatus) {
        Commission commission = findCommissionById(commissionId);

        validateStatus(newStatus);

        commission.setStatus(newStatus);
        commission.setUpdatedAt(LocalDateTime.now());

        if ("PAID".equals(newStatus)) {
            commission.setPaidAt(LocalDateTime.now());
        }

        Commission updatedCommission = commissionRepository.save(commission);
        log.info("Updated commission status to {} for commission ID: {}", newStatus, commissionId);

        return commissionMapper.toDto(updatedCommission);
    }

    public Page<CommissionDto> getFilteredCommissionsByClient(Long clientId, String status,
                                                              String type, String affiliateName,
                                                              String search, Pageable pageable) {

        Long validatedClientId = validateClientId(clientId);
        String validatedStatus = validateStringParameter(status);
        String validatedType = validateStringParameter(type);
        String validatedAffiliateName = validateStringParameter(affiliateName);
        String validatedSearch = validateStringParameter(search);

        Page<Commission> commissionsPage = commissionRepository
                .findFilteredByClient(validatedClientId, validatedStatus, validatedType,
                        validatedAffiliateName, validatedSearch, pageable);

        return commissionsPage.map(commissionMapper::toDto);
    }

    private Commission findCommissionById(Long commissionId) {
        return commissionRepository.findById(commissionId)
                .orElseThrow(() -> new CommissionNotFoundException(
                        "Commission not found with ID: " + commissionId));
    }

    private Affiliate findAffiliateById(Long affiliateId) {
        return affiliateRepository.findById(affiliateId)
                .orElseThrow(() -> new AffiliateNotFoundException(
                        "Affiliate not found with ID: " + affiliateId));
    }

    private void validateCreateRequest(CommissionCreateRequest createRequest) {
        if (createRequest.getAmount() != null && createRequest.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidCommissionDataException("Commission amount cannot be negative");
        }

        if (createRequest.getPercentage() != null &&
                (createRequest.getPercentage().compareTo(BigDecimal.ZERO) < 0 ||
                        createRequest.getPercentage().compareTo(new BigDecimal("100")) > 0)) {
            throw new InvalidCommissionDataException("Commission percentage must be between 0 and 100");
        }
    }

    private Long validateClientId(Long clientId) {
        if (clientId == null) {
            return null;
        }
        if (clientId <= 0) {
            throw new InvalidCommissionDataException("Client ID must be a positive number");
        }
        return clientId;
    }

    private String validateStringParameter(String parameter) {
        if (parameter == null || parameter.trim().isEmpty()) {
            return null;
        }
        return parameter.trim();
    }

    private void validateUpdateRequest(CommissionUpdateRequest updateRequest) {
        if (updateRequest.getAmount() != null &&
                updateRequest.getAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidCommissionDataException("Commission amount cannot be negative");
        }

        if (updateRequest.getPercentage() != null &&
                (updateRequest.getPercentage().compareTo(BigDecimal.ZERO) < 0 ||
                        updateRequest.getPercentage().compareTo(new BigDecimal("100")) > 0)) {
            throw new InvalidCommissionDataException("Commission percentage must be between 0 and 100");
        }

        if (updateRequest.getStatus() != null) {
            validateStatus(updateRequest.getStatus());
        }
    }

    private void validateStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new InvalidCommissionDataException("Status cannot be null or empty");
        }

        if (!status.matches("PENDING|PAID|CANCELLED")) {
            throw new InvalidCommissionDataException("Invalid status. Must be PENDING, PAID, or CANCELLED");
        }
    }


}