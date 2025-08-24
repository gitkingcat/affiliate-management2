package com.saas.AffiliateManagement.service;

import com.saas.AffiliateManagement.exceptions.AffiliateNotFoundException;
import com.saas.AffiliateManagement.exceptions.ClientNotFoundException;
import com.saas.AffiliateManagement.exceptions.InvalidAffiliateDataException;
import com.saas.AffiliateManagement.models.entity.Affiliate;
import com.saas.AffiliateManagement.models.requests.AffiliateCreateRequest;
import com.saas.AffiliateManagement.models.dto.AffiliateDto;
import com.saas.AffiliateManagement.models.requests.AffiliateUpdateRequest;
import com.saas.AffiliateManagement.models.entity.Client;
import com.saas.AffiliateManagement.repository.AffiliateRepository;
import com.saas.AffiliateManagement.repository.ClientRepository;
import com.saas.AffiliateManagement.service.mappers.AffiliateMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AffiliateService {

    private final AffiliateRepository affiliateRepository;
    private final ClientRepository clientRepository;
    private final AffiliateMapper affiliateMapper;
    private final EmailService emailService;

    @Transactional
    public AffiliateDto createAffiliate(AffiliateCreateRequest createRequest) {
        validateCreateRequest(createRequest);

        Client client = findClientById(createRequest.getClientId());

        if (!"ACTIVE".equals(client.getStatus())) {
            throw new InvalidAffiliateDataException("Cannot create affiliate for inactive client: " + client.getId());
        }

        if (affiliateRepository.existsByEmailAndClientId(createRequest.getEmail(), createRequest.getClientId())) {
            throw new InvalidAffiliateDataException("Affiliate with email already exists for this client: " + createRequest.getEmail());
        }

        Affiliate affiliate = affiliateMapper.toEntity(createRequest);
        affiliate.setClient(client);
        affiliate.setCreatedAt(LocalDateTime.now());
        affiliate.setUpdatedAt(LocalDateTime.now());
        affiliate.setStatus("PENDING_APPROVAL");
        affiliate.setReferralCode(generateUniqueReferralCode());

        Affiliate savedAffiliate = affiliateRepository.save(affiliate);
        log.info("Created new affiliate with ID: {} for client: {}", savedAffiliate.getId(), client.getId());

        emailService.sendAffiliateRegistrationNotification(savedAffiliate.getEmail(), savedAffiliate.getName());

        return affiliateMapper.toDto(savedAffiliate);
    }

    public AffiliateDto getAffiliateById(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);
        return affiliateMapper.toDto(affiliate);
    }

    public Page<AffiliateDto> getAllAffiliates(Pageable pageable) {
        Page<Affiliate> affiliatesPage = affiliateRepository.findAll(pageable);
        return affiliatesPage.map(affiliateMapper::toDto);
    }

    public Page<AffiliateDto> getAffiliatesByClientId(Long clientId, Pageable pageable) {
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundException("Client not found with ID: " + clientId);
        }

        Page<Affiliate> affiliatesPage = affiliateRepository.findByClientId(clientId, pageable);
        return affiliatesPage.map(affiliateMapper::toDto);
    }

    @Transactional
    public AffiliateDto updateAffiliate(Long affiliateId, AffiliateUpdateRequest updateRequest) {
        validateUpdateRequest(updateRequest);

        Affiliate existingAffiliate = findAffiliateById(affiliateId);

        if (!existingAffiliate.getEmail().equals(updateRequest.getEmail())
                && affiliateRepository.existsByEmailAndClientId(updateRequest.getEmail(), existingAffiliate.getClient().getId())) {
            throw new InvalidAffiliateDataException("Email already exists for this client: " + updateRequest.getEmail());
        }

        affiliateMapper.updateEntityFromRequest(updateRequest, existingAffiliate);
        existingAffiliate.setUpdatedAt(LocalDateTime.now());

        Affiliate updatedAffiliate = affiliateRepository.save(existingAffiliate);
        log.info("Updated affiliate with ID: {}", affiliateId);

        return affiliateMapper.toDto(updatedAffiliate);
    }

    @Transactional
    public void deleteAffiliate(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        if ("ACTIVE".equals(affiliate.getStatus())) {
            throw new InvalidAffiliateDataException("Cannot delete active affiliate. Deactivate first.");
        }

        affiliateRepository.deleteById(affiliateId);
        log.info("Deleted affiliate with ID: {}", affiliateId);

        emailService.sendAffiliateAccountDeletionNotification(affiliate.getEmail());
    }

    @Transactional
    public AffiliateDto activateAffiliate(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        if ("ACTIVE".equals(affiliate.getStatus())) {
            throw new InvalidAffiliateDataException("Affiliate is already active");
        }

        affiliate.setStatus("ACTIVE");
        affiliate.setUpdatedAt(LocalDateTime.now());

        Affiliate activatedAffiliate = affiliateRepository.save(affiliate);
        log.info("Activated affiliate with ID: {}", affiliateId);

        emailService.sendAffiliateActivationNotification(affiliate.getEmail());

        return affiliateMapper.toDto(activatedAffiliate);
    }

    @Transactional
    public AffiliateDto deactivateAffiliate(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        if ("INACTIVE".equals(affiliate.getStatus())) {
            throw new InvalidAffiliateDataException("Affiliate is already inactive");
        }

        affiliate.setStatus("INACTIVE");
        affiliate.setUpdatedAt(LocalDateTime.now());

        Affiliate deactivatedAffiliate = affiliateRepository.save(affiliate);
        log.info("Deactivated affiliate with ID: {}", affiliateId);

        emailService.sendAffiliateDeactivationNotification(affiliate.getEmail());

        return affiliateMapper.toDto(deactivatedAffiliate);
    }

    @Transactional
    public AffiliateDto approveAffiliate(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        if (!"PENDING_APPROVAL".equals(affiliate.getStatus())) {
            throw new InvalidAffiliateDataException("Only pending affiliates can be approved");
        }

        affiliate.setStatus("ACTIVE");
        affiliate.setUpdatedAt(LocalDateTime.now());

        Affiliate approvedAffiliate = affiliateRepository.save(affiliate);
        log.info("Approved affiliate with ID: {}", affiliateId);

        emailService.sendAffiliateApprovalNotification(affiliate.getEmail(), affiliate.getReferralCode());

        return affiliateMapper.toDto(approvedAffiliate);
    }

    @Transactional
    public AffiliateDto rejectAffiliate(Long affiliateId, String reason) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        if (!"PENDING_APPROVAL".equals(affiliate.getStatus())) {
            throw new InvalidAffiliateDataException("Only pending affiliates can be rejected");
        }

        affiliate.setStatus("REJECTED");
        affiliate.setRejectionReason(reason);
        affiliate.setUpdatedAt(LocalDateTime.now());

        Affiliate rejectedAffiliate = affiliateRepository.save(affiliate);
        log.info("Rejected affiliate with ID: {} for reason: {}", affiliateId, reason);

        emailService.sendAffiliateRejectionNotification(affiliate.getEmail(), reason);

        return affiliateMapper.toDto(rejectedAffiliate);
    }

    public Page<AffiliateDto> searchAffiliates(Optional<String> email,
                                               Optional<String> status,
                                               Optional<String> companyName,
                                               Optional<Long> clientId,
                                               Pageable pageable) {
        Page<Affiliate> affiliatesPage = affiliateRepository
                .searchAffiliates(
                        email.orElse(""),
                        status.orElse(""),
                        companyName.orElse(""),
                        clientId.orElse(null),
                        pageable
                );

        return affiliatesPage.map(affiliateMapper::toDto);
    }

    public Page<AffiliateDto> searchClientAffiliates(Long clientId,
                                                     Optional<String> email,
                                                     Optional<String> status,
                                                     Optional<String> companyName,
                                                     Pageable pageable) {
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundException("Client not found with ID: " + clientId);
        }

        Page<Affiliate> affiliatesPage = affiliateRepository
                .searchClientAffiliates(
                        clientId,
                        email.orElse(""),
                        status.orElse(""),
                        companyName.orElse(""),
                        pageable
                );

        return affiliatesPage.map(affiliateMapper::toDto);
    }

    public Page<AffiliateDto> getPendingApprovalAffiliates(Pageable pageable) {
        Page<Affiliate> pendingAffiliates = affiliateRepository.findByStatus("PENDING_APPROVAL", pageable);
        return pendingAffiliates.map(affiliateMapper::toDto);
    }

    public Page<AffiliateDto> getActiveAffiliates(Pageable pageable) {
        Page<Affiliate> activeAffiliates = affiliateRepository.findByStatus("ACTIVE", pageable);
        return activeAffiliates.map(affiliateMapper::toDto);
    }

    public Page<AffiliateDto> getActiveAffiliatesByClientId(Long clientId, Pageable pageable) {
        if (!clientRepository.existsById(clientId)) {
            throw new ClientNotFoundException("Client not found with ID: " + clientId);
        }

        Page<Affiliate> activeAffiliates = affiliateRepository.findByClientIdAndStatus(clientId, "ACTIVE", pageable);
        return activeAffiliates.map(affiliateMapper::toDto);
    }

    @Transactional
    public String generateReferralCode(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        if (affiliate.getReferralCode() != null) {
            throw new InvalidAffiliateDataException("Referral code already exists for affiliate: " + affiliateId);
        }

        String referralCode = generateUniqueReferralCode();
        affiliate.setReferralCode(referralCode);
        affiliate.setUpdatedAt(LocalDateTime.now());

        affiliateRepository.save(affiliate);
        log.info("Generated referral code for affiliate: {}", affiliateId);

        return referralCode;
    }

    @Transactional
    public String regenerateReferralCode(Long affiliateId) {
        Affiliate affiliate = findAffiliateById(affiliateId);

        String newReferralCode = generateUniqueReferralCode();
        affiliate.setReferralCode(newReferralCode);
        affiliate.setUpdatedAt(LocalDateTime.now());

        affiliateRepository.save(affiliate);
        log.info("Regenerated referral code for affiliate: {}", affiliateId);

        return newReferralCode;
    }

    public boolean isAffiliateOwnedByClient(Long affiliateId, String clientEmail) {
        return affiliateRepository.findById(affiliateId)
                .map(affiliate -> affiliate.getClient().getEmail().equals(clientEmail))
                .orElse(false);
    }

    public boolean existsByEmail(String email) {
        return affiliateRepository.existsByEmail(email);
    }

    public Optional<AffiliateDto> getAffiliateByEmail(String email) {
        return affiliateRepository.findByEmail(email)
                .map(affiliateMapper::toDto);
    }

    public long getTotalAffiliateCount() {
        return affiliateRepository.count();
    }

    public long getActiveAffiliateCount() {
        return affiliateRepository.countByStatus("ACTIVE");
    }

    public long getAffiliateCountByClientId(Long clientId) {
        return affiliateRepository.countByClientId(clientId);
    }

    private Affiliate findAffiliateById(Long affiliateId) {
        return affiliateRepository.findById(affiliateId)
                .orElseThrow(() -> new AffiliateNotFoundException("Affiliate not found with ID: " + affiliateId));
    }

    private Client findClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with ID: " + clientId));
    }

    private void validateCreateRequest(AffiliateCreateRequest createRequest) {
        if (createRequest.getEmail() == null || createRequest.getEmail().trim().isEmpty()) {
            throw new InvalidAffiliateDataException("Email is required");
        }

        if (createRequest.getFirstName() == null || createRequest.getFirstName().trim().isEmpty()) {
            throw new InvalidAffiliateDataException("First name is required");
        }

        if (createRequest.getLastName() == null || createRequest.getLastName().trim().isEmpty()) {
            throw new InvalidAffiliateDataException("Last name is required");
        }

        if (createRequest.getClientId() == null) {
            throw new InvalidAffiliateDataException("Client ID is required");
        }
    }

    private void validateUpdateRequest(AffiliateUpdateRequest updateRequest) {
        if (updateRequest.getEmail() == null || updateRequest.getEmail().trim().isEmpty()) {
            throw new InvalidAffiliateDataException("Email is required");
        }

        if (updateRequest.getFirstName() == null || updateRequest.getFirstName().trim().isEmpty()) {
            throw new InvalidAffiliateDataException("First name is required");
        }

        if (updateRequest.getLastName() == null || updateRequest.getLastName().trim().isEmpty()) {
            throw new InvalidAffiliateDataException("Last name is required");
        }
    }

    private String generateUniqueReferralCode() {
        String referralCode;
        do {
            referralCode = "REF_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (affiliateRepository.existsByReferralCode(referralCode));
        return referralCode;
    }
}